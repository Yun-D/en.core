import { create } from "zustand";
import type { Song } from "../type/songs";
import { persist } from "zustand/middleware";

// 셋리스트 뽑는 방식 타입
// - random: 랜덤모드
// - choose: 곡 선택모드
export type SetlistMode = "random" | "choose";

export interface Setlist {
  items: Song[];
  mode: SetlistMode;
  createdAt: number; // '뽑기' 버튼을 누른 시각(재진입 안내 & 상대시간 기준)
}

interface SetlistState {
  setlist: Setlist | null;
  setSetlist: (setlist: Setlist) => void;
  clearSetlist: () => void;
}

export const useSetlistStore = create<SetlistState>()(
  persist(
    (set) => ({
      setlist: null,
      setSetlist: (setlist) => set({ setlist }),
      clearSetlist: () => set({ setlist: null }),
    }),
    {
      name: "setlist-store",
    },
  ),
);
