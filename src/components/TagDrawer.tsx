import { useTagStore } from "../store/useTagStore";
import Drawer from "./Drawer";
import { TagChip } from "./TagChip";
import { getTagChipCategory, type TagCategory } from "../type/tags";
import { useState } from "react";

interface TagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TagDrawer = ({ isOpen, onClose }: TagDrawerProps) => {
  // 어느 그룹에서 입력 중인지. null이면 입력 안 하는 중
  const [addingCategory, setAddingCategory] = useState<TagCategory | null>(
    null,
  );
  const [newTagName, setNewTagName] = useState("");

  const tags = useTagStore((state) => state.tags);
  const addCustomTag = useTagStore((state) => state.addCustomTag);
  const removeCustomTag = useTagStore((state) => state.removeCustomTag);

  // + 버튼 -> 입력 칩 열기
  const handleStartAdding = (category: TagCategory) => {
    setAddingCategory(category);
    setNewTagName("");
  };

  // Enter용 (실제 저장)
  const handleSubmitTag = (category: TagCategory) => {
    const label = newTagName.trim();
    if (!label) return;

    // 그룹 상관없이 전체 이름 기준 중복 검사
    const isDuplicate = tags.some((tag) => tag.label === label);
    if (isDuplicate) return; // TODO: 중복 안내 표시

    addCustomTag(label, category);
    setNewTagName("");
    setAddingCategory(null);
  };

  // x 버튼 (생성 취소)
  const handleCancelAdding = () => {
    setAddingCategory(null);
    setNewTagName("");
  };

  const handleExit = () => {
    setAddingCategory(null);
    setNewTagName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={handleExit}>
      <h2 className="text-xl font-bold m-0">커스텀 태그</h2>
      <p className="text-sm text-(--color-text-secondary) m-0">
        커스텀 태그를 관리할 수 있어요.
      </p>

      <div className="flex flex-col gap-2 mt-2">
        {(["mood", "situation"] as const).map((category) => (
          <div key={category} className="flex flex-col gap-2">
            <p className="text-xs text-(--color-text-placeholder)">
              {category === "mood" ? "분위기" : "상황"}
            </p>

            <div className="flex gap-2 flex-wrap items-center">
              {tags
                .filter((tag) => tag.category === category)
                .map((tag) => (
                  <div key={tag.id} className="flex items-center gap-1">
                    <TagChip
                      label={tag.label}
                      category={getTagChipCategory(tag)}
                      readOnly={tag.isDefault} // 기본 태그는 안내용이라 선택 불가
                      onDelete={
                        tag.isDefault
                          ? undefined
                          : () => removeCustomTag(tag.id)
                      }
                    />
                  </div>
                ))}

              {addingCategory === category && (
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 
                   border border-(--tag-custom-border) bg-(--tag-custom-bg) text-(--tag-custom-text) "
                >
                  <span className="grid text-base">
                    {/* 보이지 않지만 자리 차지하여 칸 너비 결정 */}
                    <span className="col-start-1 row-start-1 invisible min-w-15 whitespace-pre">
                      {newTagName}
                    </span>

                    <input
                      type="text"
                      value={newTagName}
                      size={1}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        // 문자 조합중에는 Enter 다루지 않음 (안녕 : 안녕, 녕 방지)
                        if (e.key === "Enter" && !e.nativeEvent.isComposing)
                          handleSubmitTag(category);
                      }}
                      maxLength={8}
                      autoFocus
                      className="col-start-1 row-start-1 w-full bg-transparent min-w-0 focus:outline-none"
                    />
                  </span>
                  <button onClick={handleCancelAdding}>
                    <i className="ti ti-x" />
                  </button>
                </div>
              )}

              <TagChip
                label="+"
                category="custom"
                onClick={() => handleStartAdding(category)}
              />
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default TagDrawer;
