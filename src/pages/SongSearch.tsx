import { useState } from "react";
import HeroSection from "../components/HeroSection";
import SongCard from "../components/SongCard";
import NewSongs from "./NewSongs";
import { useSongActions } from "../hooks/useSongActions";
import { type BrandKey, type KaraokeAPISong } from "../type/api";

type SearchResult = KaraokeAPISong & { brand: string };

const SongSearch = () => {
  const [brand, setBrand] = useState<BrandKey>("tj"); // 검색할 노래방 브랜드 상태
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]); // 검색 결과 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isSearched, setIsSearched] = useState(false); // 검색 여부 상태 (검색 결과 없을 때를 위해..)

  const { isAdded, handleAddSong } = useSongActions(brand);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setIsSearched(true);

    try {
      const [titleRes, singerRes] = await Promise.all([
        fetch(
          `https://api.manana.kr/karaoke/song/${encodeURIComponent(query)}.json?brand=${brand}`,
        ),
        fetch(
          `https://api.manana.kr/karaoke/singer/${encodeURIComponent(query)}.json?brand=${brand}`,
        ),
      ]);

      const [titleData, singerData] = await Promise.all([
        titleRes.json(),
        singerRes.json(),
      ]);

      const merged = [...titleData, ...singerData];
      const uniqueResults = merged.filter(
        (song: SearchResult, index: number, self: SearchResult[]) =>
          self.findIndex((s) => s.no === song.no) === index,
      );

      const sortedResults = uniqueResults.sort(
        (a: SearchResult, b: SearchResult) => {
          const aMatch = a.title.includes(query) ? 0 : 1;
          const bMatch = b.title.includes(query) ? 0 : 1;
          return aMatch - bMatch;
        },
      );

      setResults(sortedResults);
    } catch (error) {
      console.error("검색 실패: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <HeroSection title="노래방 검색" subtitle={"TJ, 금영 노래방 검색"} />

      <div className="flex flex-col gap-3">
        {/* 브랜드 선택 -------------------------------------------*/}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setBrand("tj");
              setResults([]);
              setIsSearched(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border
            transition-colors ${
              brand === "tj"
                ? "text-(--color-accent) border-(--color-primary)"
                : "text-(--color-text-placeholder) border-(--color-surface-elevated)"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${brand === "tj" ? "bg-(--color-accent)" : "bg-(--color-surface-elevated)"}`}
            />
            TJ 노래방
          </button>
          <button
            onClick={() => {
              setBrand("kumyoung");
              setResults([]);
              setIsSearched(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border
              transition-colors ${
                brand === "kumyoung"
                  ? "text-(--color-accent) border-(--color-primary)"
                  : "text-(--color-text-placeholder) border-(--color-surface-elevated)"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${brand === "kumyoung" ? "bg-(--color-accent)" : "bg-(--color-surface-elevated)"}`}
            />
            금영 노래방
          </button>
        </div>

        {/* 검색창 ------------------------------------------------*/}
        <div
          className="flex items-center gap-2 border border-(--color-surface-elevated) rounded-xl
        bg-(--color-surface) px-4 py-2 mb-3"
        >
          <i className="ti ti-search text-(--color-text-placeholder)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="text-base outline-none w-full"
            placeholder="곡 제목이나 가수로 검색해보세요"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsSearched(false);
              }}
              className="flex items-center"
            >
              <i className="ti ti-x text-(--color-text-placeholder) text-xs" />
            </button>
          )}
        </div>

        {/* 검색 결과 ------------------------------------------------*/}
        {isLoading && (
          <p className="text-sm text-(--color-text-placeholder) mt-2">
            🔎 검색중...
          </p>
        )}
        {!isLoading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-(--color-text-placeholder)">
                검색 결과
              </span>
              <span className="text-xs font-semibold text-(--color-accent)">
                {results.length}곡
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {results.map((result) => (
                <SongCard
                  key={result.no}
                  song={result}
                  brand={brand}
                  isAdded={isAdded(result.no)}
                  onAdd={() => handleAddSong(result)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 없음 ------------------------------------------------*/}
        {!isLoading && isSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="flex items-center justify-center rounded-full h-10 w-10 border border-(--color-accent) bg-[#f472b550] mb-1">
              <i className="ti ti-search text-xl mb-0.5" />
            </div>
            <p className="text-sm text-(--color-text-placeholder) mt-2 text-center">
              '{query}' 검색 결과가 없어요. <br />
              <br />
              찾는 곡이 없다면 다른 표기로 검색해보세요 <br />
              (한글 ↔ 영어 또는 제목 ↔ 가수 검색)
            </p>
          </div>
        )}
      </div>

      {/* 신곡 목록 ------------------------------------------------*/}
      {!isSearched && <NewSongs brand={brand} />}
    </div>
  );
};

export default SongSearch;
