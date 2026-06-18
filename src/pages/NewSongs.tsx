import { useState, useEffect } from "react";
import SongCard from "../components/SongCard";
import { useSongActions } from "../hooks/useSongActions";
import { type BrandKey, type KaraokeAPISong } from "../data/api";

type NewSong = KaraokeAPISong & { brand: string; release: string };

type Props = {
  brand?: BrandKey; // 기본값은 tj
};

const NewSongs = ({ brand = "tj" }: Props) => {
  const [songs, setSongs] = useState<NewSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isAdded, handleAddSong } = useSongActions(brand);

  useEffect(() => {
    const fetchNewSongs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.manana.kr/karaoke/${brand}.json`,
        );
        const data = await response.json();
        setSongs(data);
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
        <SongCard
          key={song.no}
          song={song}
          brand={brand}
          isAdded={isAdded(song.no)}
          onAdd={() => handleAddSong(song)}
        />
      ))}
    </div>
  );
};

export default NewSongs;
