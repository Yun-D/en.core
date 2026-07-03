interface TagChipProps {
  label: string;
  category: "mood" | "situation";
  active?: boolean;
  onClick?: () => void;
}

export const TagChip = ({ label, category, active, onClick }: TagChipProps) => {
  return (
    <button
      className={`cursor-pointer rounded-full border px-2 py-1 text-xs border-(--tag-${category}-border) ${
        active
          ? `bg-(--tag-${category}-hover-bg) text-(--tag-${category}-hover-text)`
          : `bg-(--tag-${category}-bg) text-(--tag-${category}-text) hover:bg-(--tag-${category}-hover-bg) hover:text-(--tag-${category}-hover-text)`
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
