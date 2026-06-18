import { type BrandKey, type KaraokeAPISong } from "../data/api";

type Props = {
  song: KaraokeAPISong;
  brand: BrandKey;
  isAdded: boolean;
  onAdd: () => void;
};

const SongCard = ({ song, brand, isAdded, onAdd }: Props) => {
  return (
    <div
      className="flex items-center gap-3 bg-(--color-surface) border border-(--color-surface-elevated) rounded-xl
      px-3 py-3"
    >
      <div className="flex flex-col items-start shrink-0 min-w-13">
        <span
          className={`text-xs font-bold rounded px-1 py-0.5
          ${brand === "tj" ? "bg-(--tag-mood-bg)" : "bg-(--tag-situation-bg)"}`}
        >
          {brand === "tj" ? "TJ" : "KY"}
        </span>
        <span className="text-base font-bold px-1 py-0.5">{song.no}</span>
      </div>

      {/* 구분선 */}
      <div className="w-px h-8 bg-(--color-surface-elevated) shrink-0" />

      {/* 곡 제목, 가수 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-(--color-text-primary)">
          {song.title}
        </p>
        <p className="text-xs text-(--color-text-secondary) mt-0.5">
          {song.singer}
        </p>
      </div>

      {/* 추가 버튼 */}
      {isAdded ? (
        <span
          className="text-xs shrink-0 px-3 py-1.5 rounded-2xl flex items-center
          border border-(--color-surface-elevated) text-(--color-text-placeholder)"
        >
          <i className="ti ti-check text-xs mr-1" />
          추가됨
        </span>
      ) : (
        <button
          onClick={onAdd}
          className="cursor-pointer text-xs shrink-0 px-3 py-1.5 rounded-2xl flex items-center
          border-(--tag-mood-border) text-(--tag-mood-hover-text) bg-(--tag-mood-hover-bg)"
        >
          <i className="ti ti-plus text-xs mr-1" />곡 추가
        </button>
      )}
    </div>
  );
};

export default SongCard;
