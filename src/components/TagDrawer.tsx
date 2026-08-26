import { useTagStore } from "../store/useTagStore";
import Drawer from "./Drawer";
import { TagChip } from "./TagChip";
import { getTagChipCategory } from "../type/tags";

interface TagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TagDrawer = ({ isOpen, onClose }: TagDrawerProps) => {
  const tags = useTagStore((state) => state.tags);

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
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

            <div className="flex gap-2 flex-wrap">
              {tags
                .filter((tag) => tag.category === category)
                .map((tag) => (
                  <TagChip
                    key={tag.id}
                    label={tag.label}
                    category={getTagChipCategory(tag)}
                    readOnly={tag.isDefault} // 기본 태그는 안내용이라 선택 불가
                  />
                ))}

              <TagChip
                label="+"
                category="custom"
                //onClick={() => handleAddTag(category)}
              />
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default TagDrawer;
