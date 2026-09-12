import type { TablerIcon } from "@tabler/icons-react";

interface AccentButtonProps {
  onClick: () => void;
  icon?: TablerIcon;
  text: string;
  size?: number;
  disabled?: boolean;
}

export const AccentButton = ({
  onClick,
  icon: Icon,
  text,
  size,
  disabled = false,
}: AccentButtonProps) => {
  return (
    <button
      type="button"
      className="cursor-pointer w-full h-10 rounded-xl mt-2 mb-2
        bg-(--color-accent) hover:bg-(--color-accent-hover) transition-colors duration-200 px-5 py-2 text-sm font-semibold
        disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className={`w-${size} h-${size} mr-2 inline`} aria-hidden="true" />}
      {text}
    </button>
  );
};
