import { create } from "zustand";
import type { Song } from "../type/songs";
import { persist } from "zustand/middleware";

type SongStore = {
  songs: Song[];
  addSong: (song: Omit<Song, "id">) => void; // id는 자동으로 생성되도록 Omit<Song, "id"> 사용
  removeSong: (id: number) => void;
  updateSong: (id: number, updated: Partial<Song>) => void; // 수정 시 바꾸고 싶은 필드만 전달할 수 있도록 Partial(?) 사용
};

export const useSongStore = create<SongStore>()(
  persist(
    (set) => ({
      songs: [],

      addSong: (song) =>
        set((state) => ({
          songs: [
            ...state.songs,
            {
              ...song,
              id: Date.now(), // 간단히 고유 ID 생성
            },
          ],
        })),

      removeSong: (id) =>
        set((state) => ({
          songs: state.songs.filter((song) => song.id !== id),
        })),

      updateSong: (id, updated) =>
        set((state) => ({
          songs: state.songs.map((song) =>
            song.id === id ? { ...song, ...updated } : song,
          ),
        })),
    }),
    { name: "song-store" }, // 로컬 스토리지에 "song-store"라는 키로 저장
  ),
);
