import type { TablerIcon } from "@tabler/icons-react";

interface ModeButtonProps {
  active: boolean;
  icon: TablerIcon;
  label: string;
  onClick: () => void;
}

export const ModeButton = ({
  active,
  icon:Icon,
  label,
  onClick,
}: ModeButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`cursor-pointer flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm ${
        active
          ? "text-(--color-accent) border-(--color-primary) bg-(--color-accent)/20 border-[1.5px]"
          : "border-(--color-surface-elevated) bg-(--color-surface-elevated)/20 text-(--color-text-placeholder)"
      }`}
    >
      <Icon className="w-4.5 h-4.5 inline" aria-hidden="true" />
      {label}
    </button>
  );
};
