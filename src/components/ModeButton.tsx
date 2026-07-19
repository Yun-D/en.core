interface ModeButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

export const ModeButton = ({
  active,
  icon,
  label,
  onClick,
}: ModeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm ${
        active
          ? "text-(--color-accent) border-(--color-primary) bg-(--color-accent)/20 border-[1.5px]"
          : "border-(--color-surface-elevated) bg-(--color-surface-elevated)/20 text-(--color-text-placeholder)"
      }`}
    >
      <i className={`ti ${icon} text-[15px]`} aria-hidden="true" />
      {label}
    </button>
  );
};
