import { persist } from "zustand/middleware";
import { DEFAULT_TAGS, type Tag, type TagCategory } from "../type/tags";
import { create } from "zustand";

type TagStore = {
  tags: Tag[];

  addCustomTag: (label: string, category: TagCategory) => void;
  removeCustomTag: (id: number) => void;
  setTags: (tags: Tag[]) => void; // 전체 태그 목록을 한 번에 바꾸는 메서드
};

export const useTagStore = create<TagStore>()(
  persist(
    (set) => ({
      tags: DEFAULT_TAGS, // 초기 태그는 기본 태그로 시작

      addCustomTag: (label: string, category: TagCategory) =>
        set((state) => ({
          tags: [
            ...state.tags,
            {
              id: Date.now(), // 간단히 고유 ID 생성
              label,
              category, // 추가한 위치의 카테고리를 따라감
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
    {
      name: "tag-store", // 로컬 스토리지에 "tag-store"라는 키로 저장
      version: 2, // DEFAULT_TAGS 수정 할 때마다 +1
      migrate: (persisted) => {
        // 예전 사용자 태그는 category가 "custom"이거나 group에 카테고리가 들어있음
        const state = persisted as Omit<TagStore, "tags"> & {
          tags: (Omit<Tag, "category"> & {
            category: TagCategory | "custom";
            group?: TagCategory;
          })[];
        };
        const customTags: Tag[] = state.tags
          .filter((tag) => !tag.isDefault)
          .map(({ id, label, category, group }) => ({
            id,
            label,
            category: category === "custom" ? (group ?? "mood") : category,
            isDefault: false,
          }));
        return { ...state, tags: [...DEFAULT_TAGS, ...customTags] };
      },
    },
  ),
);
