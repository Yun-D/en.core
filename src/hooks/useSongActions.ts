import { useSongStore } from "../store/useSongStore";
import { type BrandKey, type KaraokeAPISong } from "../type/api";

export const useSongActions = (brand: BrandKey) => {
  const savedSongs = useSongStore((state) => state.songs);
  const addSong = useSongStore((state) => state.addSong);

  // 현재 검색 브랜드에 해당하는 곡 번호가 이미 저장된 곡 목록에 있는지 확인
  const isAdded = (no: string) =>
    savedSongs.some((song) =>
      brand === "tj"
        ? song.number_tj === Number(no)
        : song.number_ky === Number(no),
    );

  const handleAddSong = (song: KaraokeAPISong) => {
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

  return { isAdded, handleAddSong };
};
