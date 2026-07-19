import { type Song } from "../type/songs";
import { useTagStore } from "../store/useTagStore";

interface SavedSongCardProps {
  song: Song;
  onClick?: () => void;
}

const SavedSongCard = ({ song, onClick }: SavedSongCardProps) => {
  const { tags } = useTagStore();

  const songTags = tags.filter((tag) => song.tags.includes(tag.id));
  const moodTags = songTags.filter((tag) => tag.category === "mood");
  const situTags = songTags.filter((tag) => tag.category === "situation");

  const displayKey =
    song.song_key === 0
      ? null
      : song.song_key > 0
        ? `키 +${song.song_key}`
        : `키 ${song.song_key}`;

  return (
    <div
      onClick={onClick}
      className="bg-(--color-surface) rounded-2xl p-4 mb-1 border border-(--color-surface-elevated)
      hover:bg-(--color-surface-hover) transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-center">
        <div className="flex-1 min-w-0 mr-2">
          <p className="text-sm font-bold truncate">{song.title}</p>
          <p className="text-xs text-(--color-text-secondary) mt-0.5">
            {song.artist}
          </p>
        </div>

        {(song.number_tj || song.number_ky) && (
          <div className="flex flex-col items-end gap-1/2 shrink-0 mr-4">
            {song.number_tj && (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-(--color-text-placeholder)">
                  TJ
                </span>
                <span className="text-sm font-bold text-(--color-text-secondary)">
                  {song.number_tj}
                </span>
              </div>
            )}
            {song.number_ky && (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-(--color-text-placeholder)">
                  KY
                </span>
                <span className="text-sm font-bold text-(--color-text-secondary)">
                  {song.number_ky}
                </span>
              </div>
            )}
          </div>
        )}

        <i
          className={`ti ti-bookmark-filled text-lg shrink-0 ${
            song.isLater
              ? "text-(--tag-key-text)"
              : "text-(--color-text-placeholder)"
          }`}
        />
      </div>

      {/* 태그 --------------------------------------------*/}
      {(moodTags.length > 0 ||
        situTags.length > 0 ||
        song.song_key !== undefined) && (
        <div className="flex flex-wrap gap-1 mt-3">
          {moodTags.map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2 py-0.5 rounded-full border
                        bg-(--tag-mood-bg) text-(--tag-mood-text) border-(--tag-mood-border)"
            >
              {tag.label}
            </span>
          ))}
          {situTags.map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2 py-0.5 rounded-full border
                        bg-(--tag-situation-bg) text-(--tag-situation-text) border-(--tag-situation-border)"
            >
              {tag.label}
            </span>
          ))}

          {displayKey && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full border
            bg-(--tag-key-bg) text-(--tag-key-text) border-(--tag-key-border)"
            >
              {displayKey}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedSongCard;
