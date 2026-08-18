interface AccentButtonProps {
  onClick: () => void;
  icon?: string;
  text: string;
  disabled?: boolean;
}

export const AccentButton = ({
  onClick,
  icon,
  text,
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
      {icon && <i className={`ti ${icon} mr-2`} />}
      {text}
    </button>
  );
};
