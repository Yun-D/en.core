import { useState, useEffect } from "react";
import { useSongStore } from "../store/useSongStore";

type BrandKey = "tj" | "kumyoung";

type NewSong = {
  brand: string;
  no: string;
  title: string;
  singer: string;
  release: string;
};

type Props = {
  brand?: BrandKey; // 기본값은 tj
};

const NewSongs = ({ brand = "tj" }: Props) => {
  const [songs, setSongs] = useState<NewSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const savedSongs = useSongStore((state) => state.songs);
  const addSong = useSongStore((state) => state.addSong);

  // 현재 검색 브랜드에 해당하는 곡 번호가 이미 저장된 곡 목록에 있는지 확인
  const isAdded = (no: string) => {
    return savedSongs.some((song) =>
      brand === "tj"
        ? song.number_tj === Number(no)
        : song.number_ky === Number(no),
    );
  };

  const handleAddSong = (song: NewSong) => {
    addSong({
      title: song.title,
      artist: song.singer,
      number_tj: brand === "tj" ? Number(song.no) : undefined,
      number_ky: brand === "kumyoung" ? Number(song.no) : undefined,
      song_key: 0,
      tags: [],
      isLater: false,
    });
  };

  useEffect(() => {
    const fetchNewSongs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.manana.kr/karaoke/${brand}.json`,
        );
        const data = await response.json();
        setSongs(data);
        console.log("신곡 데이터:", data);
      } catch (error) {
        console.error("신곡 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewSongs();
  }, [brand]);

  if (isLoading) {
    return (
      <p className="text-sm text-(--color-text-placeholder) mt-2">
        🔎 신곡 로딩중...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <span className="text-xs text-(--color-text-placeholder)">
        이번주 신곡
      </span>

      {songs.map((song) => (
        <div
          key={song.no}
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
            <span className="text-base font-bold px-1 py-0.5">{song.no}</span>
          </div>

          {/* 구분선 */}
          <div className="w-px h-8 bg-(--color-surface-elevated) shrink-0" />

          {/* 곡 제목, 가수 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-(--color-text-primary)">
              {song.title}
            </p>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              {song.singer}
            </p>
          </div>

          {/* 추가 버튼 */}
          {isAdded(song.no) ? (
            <span
              className="text-xs shrink-0 px-3 py-1.5 rounded-2xl flex items-center
                      border border-(--color-surface-elevated) text-(--color-text-placeholder)"
            >
              <i className="ti ti-check text-xs mr-1" />
              추가됨
            </span>
          ) : (
            <button
              onClick={() => handleAddSong(song)}
              className="cursor-pointer text-xs shrink-0 px-3 py-1.5 rounded-2xl flex items-center
                      border-(--tag-mood-border) text-(--tag-mood-hover-text) bg-(--tag-mood-hover-bg)"
            >
              <i className="ti ti-plus text-xs mr-1" />곡 추가
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewSongs;
