import { useState } from "react";
import HeroSection from "../components/HeroSection";
import { useSongStore } from "../store/useSongStore";

type BrandKey = "tj" | "kumyoung";

// API 응답에서 곡 정보를 나타내는 타입 정의
type SearchResult = {
  brand: string;
  no: string;
  title: string;
  singer: string;
};

const SongSearch = () => {
  const [brand, setBrand] = useState<BrandKey>("tj"); // 검색할 노래방 브랜드 상태
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]); // 검색 결과 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isSearched, setIsSearched] = useState(false); // 검색 여부 상태 (검색 결과 없을 때를 위해..)

  const songs = useSongStore((state) => state.songs);
  const addSong = useSongStore((state) => state.addSong);

  // 현재 검색 브랜드에 해당하는 곡 번호가 이미 저장된 곡 목록에 있는지 확인
  const isAdded = (no: string) => {
    return songs.some((song) =>
      brand === "tj"
        ? song.number_tj === Number(no)
        : song.number_ky === Number(no),
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return; // 검색어가 비어있으면 검색하지 않음
    setIsLoading(true);
    setIsSearched(true);

    try {
      const [titleRes, singerRes] = await Promise.all([
        fetch(
          `https://api.manana.kr/karaoke/song/${encodeURIComponent(query)}.json?brand=${brand}`,
        ), // 제목 검색 API
        fetch(
          `https://api.manana.kr/karaoke/singer/${encodeURIComponent(query)}.json?brand=${brand}`,
        ), // 가수 검색 API
      ]);

      const [titleData, singerData] = await Promise.all([
        titleRes.json(),
        singerRes.json(),
      ]);

      // 제목과 가수 검색 결과를 병합하고 중복 제거
      const merged = [...titleData, ...singerData];
      const uniqueResults = merged.filter(
        (
          song: SearchResult,
          index: number,
          self: SearchResult[], // song(현재 요소), index(현재 요소의 인덱스), self(원본 배열 전체)
        ) => self.findIndex((s) => s.no === song.no) === index, // 두 번째 이후 등장하는 중복 요소는 제거하고 첫 번째 요소만 남김
      );

      // 제목 검색 결과와 가수 검색 결과를 정렬하여 제목이 검색어를 포함하는 곡이 먼저 나오도록 함
      const sortedResults = uniqueResults.sort(
        (a: SearchResult, b: SearchResult) => {
          const aMatch = a.title.includes(query) ? 0 : 1; // 제목에 검색어가 포함되면 0, 아니면 1
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

  const handleAddSong = (result: SearchResult) => {
    addSong({
      title: result.title,
      artist: result.singer,
      number_tj: brand === "tj" ? Number(result.no) : undefined,
      number_ky: brand === "kumyoung" ? Number(result.no) : undefined,
      song_key: 0,
      tags: [],
      isLater: false,
    });
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
              if (e.key === "Enter") {
                handleSearch();
              }
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
            🔎 검색 중...
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
                <div
                  key={result.no}
                  className="flex items-center gap-3 bg-(--color-surface) border border-(--color-surface-elevated) rounded-xl 
                  px-3 py-3"
                >
                  <div className="flex flex-col items-start shrink-0 min-w-13">
                    <span
                      className={`text-xs font-bold rounded px-1 py-0.5 
                      ${brand === "tj" ? "bg-(--tag-mood-bg)" : "bg-(--tag-situation-bg)"}`}
                    >
                      {brand === "tj" ? "TJ" : "KY"}
                    </span>
                    <span className="text-base font-bold px-1 py-0.5">
                      {result.no}
                    </span>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px h-8 bg-(--color-surface-elevated) shrink-0" />

                  {/* 곡 제목, 가수 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-(--color-text-primary)">
                      {result.title}
                    </p>
                    <p className="text-xs text-(--color-text-secondary) mt-0.5">
                      {result.singer}
                    </p>
                  </div>

                  {/* 추가 버튼 */}
                  {isAdded(result.no) ? (
                    <span
                      className="text-xs shrink-0 px-3 py-1.5 rounded-2xl flex items-center
                      border border-(--color-surface-elevated) text-(--color-text-placeholder)"
                    >
                      <i className="ti ti-check text-xs mr-1" />
                      추가됨
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddSong(result)}
                      className="cursor-pointer text-xs shrink-0 px-3 py-1.5 rounded-2xl flex items-center
                      border-(--tag-mood-border) text-(--tag-mood-hover-text) bg-(--tag-mood-hover-bg)"
                    >
                      <i className="ti ti-plus text-xs mr-1" />곡 추가
                    </button>
                  )}
                </div>
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
            <p className="text-sm text-(--color-text-placeholder) mt-2">
              '{query}' 검색 결과가 없어요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongSearch;
