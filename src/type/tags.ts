export type TagCategory = "mood" | "situation"; // 태그의 카테고리 (분위기, 상황)

export type Tag = {
  id: number;
  label: string;
  category: TagCategory; // 어느 묶음에 속하는지 (커스텀 태그도 둘 중 하나에 속함)
  isDefault: boolean; // 기본 태그인지 여부 (true면 기본 태그, false면 사용자 정의 태그)
};

export const getTagChipCategory = (tag: Tag) =>
  tag.isDefault ? tag.category : ("custom" as const);

export const DEFAULT_TAGS: Tag[] = [
  // 분위기(mood)
  { id: 1, label: "신나는", category: "mood", isDefault: true },
  { id: 2, label: "잔잔한", category: "mood", isDefault: true },
  { id: 3, label: "발라드", category: "mood", isDefault: true },
  { id: 4, label: "댄스", category: "mood", isDefault: true },
  { id: 5, label: "시즌송", category: "mood", isDefault: true },

  // 상황(situation)
  { id: 6, label: "회식", category: "situation", isDefault: true },
  { id: 7, label: "듀엣", category: "situation", isDefault: true },
  { id: 8, label: "첫곡", category: "situation", isDefault: true },
  { id: 9, label: "마무리곡", category: "situation", isDefault: true },
];
