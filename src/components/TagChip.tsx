interface TagChipProps {
  label: string;
  category: "mood" | "situation" | "later" | "custom";
  active?: boolean;
  readOnly?: boolean; // 선택 없이 보여주기만 할 때
  onClick?: () => void;
  onDelete?: () => void;
}
const TAG_CHIP_STYLES = {
  mood: {
    base: "border-(--tag-mood-border) bg-(--tag-mood-bg) text-(--tag-mood-text)",
    hover: "hover:bg-(--tag-mood-hover-bg) hover:text-(--tag-mood-hover-text)",
    active:
      "border-(--tag-mood-border) bg-(--tag-mood-hover-bg) text-(--tag-mood-hover-text)",
  },
  situation: {
    base: "border-(--tag-situation-border) bg-(--tag-situation-bg) text-(--tag-situation-text)",
    hover:
      "hover:bg-(--tag-situation-hover-bg) hover:text-(--tag-situation-hover-text)",
    active:
      "border-(--tag-situation-border) bg-(--tag-situation-hover-bg) text-(--tag-situation-hover-text)",
  },
  later: {
    base: "border-(--tag-key-border) bg-(--tag-key-bg) text-(--tag-key-text)",
    hover: "hover:bg-(--tag-key-hover-bg) hover:text-(--tag-key-hover-text)",
    active:
      "border-(--tag-key-border) bg-(--tag-key-hover-bg) text-(--tag-key-hover-text)",
  },
  custom: {
    base: "border-(--tag-custom-border) bg-(--tag-custom-bg) text-(--tag-custom-text)",
    hover:
      "hover:bg-(--tag-custom-hover-bg) hover:text-(--tag-custom-hover-text)",
    active:
      "border-(--tag-custom-border) bg-(--tag-custom-hover-bg) text-(--tag-custom-hover-text)",
  },
} as const;

const TAG_CHIP_BASE = "rounded-full border px-2 py-1 text-xs transition-colors";

// readOnly는 category와 무관한 상태라 별도 스타일
const TAG_CHIP_READONLY =
  "cursor-default border-(--tag-readonly-border) bg-(--tag-readonly-bg) text-(--tag-readonly-text)";

export const TagChip = ({
  label,
  category,
  active,
  readOnly,
  onClick,
  onDelete,
}: TagChipProps) => {
  if (readOnly)
    return (
      <span className={`${TAG_CHIP_BASE} ${TAG_CHIP_READONLY}`}>{label}</span>
    );

  const styles = TAG_CHIP_STYLES[category];
  const colorStyles = `${active ? styles.active : styles.base}`;

  // 삭제 가능한 칩
  if (onDelete)
    return (
      <span
        className={`${TAG_CHIP_BASE} ${colorStyles} inline-flex items-center gap-1`}
      >
        {label}
        <button onClick={onDelete} className="cursor-pointer">
          <i className="ti ti-x" />
        </button>
      </span>
    );

  return (
    <button
      onClick={onClick}
      className={`${TAG_CHIP_BASE} cursor-pointer ${colorStyles}`}
    >
      {label}
    </button>
  );
};
