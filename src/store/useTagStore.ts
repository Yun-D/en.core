import { persist } from "zustand/middleware";
import { DEFAULT_TAGS, type Tag } from "../data/tags";
import { create } from "zustand";

type TagStore = {
  tags: Tag[];

  // TODO: 커스텀 태그 추가/삭제 함수는 나중에 구현..
  addCustomTag: (label: string) => void;
  // removeCustomTag: (id: number) => void;
};

export const useTagStore = create<TagStore>()(
  persist(
    (set) => ({
      tags: DEFAULT_TAGS, // 초기 태그는 기본 태그로 시작

      addCustomTag: (label: string) =>
        set((state) => ({
          tags: [
            ...state.tags,
            {
              id: Date.now(), // 간단히 고유 ID 생성
              label,
              category: "custom",
              isDefault: false,
            },
          ],
        })),
    }),
    { name: "tag-store" }, // 로컬 스토리지에 "tag-store"라는 키로 저장
  ),
);
