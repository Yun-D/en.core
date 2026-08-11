import { persist } from "zustand/middleware";
import { DEFAULT_TAGS, type Tag } from "../type/tags";
import { create } from "zustand";

type TagStore = {
  tags: Tag[];

  addCustomTag: (label: string) => void;
  removeCustomTag: (id: number) => void;
  setTags: (tags: Tag[]) => void; // 전체 태그 목록을 한 번에 바꾸는 메서드
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
      removeCustomTag: (id: number) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        })),

      setTags: (tagData) => set({ tags: tagData }),
    }),
    { name: "tag-store" }, // 로컬 스토리지에 "tag-store"라는 키로 저장
  ),
);
