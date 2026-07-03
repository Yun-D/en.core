import { useState } from "react";

export const useTagSelection = (initialTagIds: number[] = []) => {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialTagIds);

  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds(
      (prev) =>
        prev.includes(tagId)
          ? prev.filter((id) => id !== tagId) // 이미 있으면 제거
          : [...prev, tagId], // 없으면 추가
    );
  };

  return { selectedTagIds, handleToggleTag };
};
