interface TagChipProps {
  label: string;
  category: "mood" | "situation";
  active?: boolean;
  onClick?: () => void;
}
// category별 완성된 클래스 (Tailwind가 스캔할 수 있게 문자열 그대로 존재)
const TAG_CHIP_STYLES = {
  mood: {
    base: "border-(--tag-mood-border) bg-(--tag-mood-bg) text-(--tag-mood-text) hover:bg-(--tag-mood-hover-bg) hover:text-(--tag-mood-hover-text)",
    active:
      "border-(--tag-mood-border) bg-(--tag-mood-hover-bg) text-(--tag-mood-hover-text)",
  },
  situation: {
    base: "border-(--tag-situation-border) bg-(--tag-situation-bg) text-(--tag-situation-text) hover:bg-(--tag-situation-hover-bg) hover:text-(--tag-situation-hover-text)",
    active:
      "border-(--tag-situation-border) bg-(--tag-situation-hover-bg) text-(--tag-situation-hover-text)",
  },
} as const;

export const TagChip = ({ label, category, active, onClick }: TagChipProps) => {
  const styles = TAG_CHIP_STYLES[category];

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-2 py-1 text-xs ${
        active ? styles.active : styles.base
      }`}
    >
      {label}
    </button>
  );
};
