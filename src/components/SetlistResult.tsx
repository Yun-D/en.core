import type { Setlist } from "../store/useSetlistStore";
import { getTagChipCategory, type Tag } from "../type/tags";
import { formatRelativeTime } from "../utils/time";

interface SetlistResultProps {
  setlist: Setlist;
  tags: Tag[];
  now: number;
}

const SetlistResult = ({ setlist, tags, now }: SetlistResultProps) => {
  return (
    <div className="mt-4 border-t border-dashed border-(--color-surface-elevated) pt-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-(--color-text-placeholder)">
          오늘의 셋리스트 - {setlist.items.length}곡
        </p>
        <p className="text-xs text-(--color-text-placeholder)">
          {formatRelativeTime(setlist.createdAt, now)}
        </p>
      </div>

      {/* key가 바뀌면 애니메이션이 다시 재생하게끔! */}
      <div className="flex flex-col gap-2" key={setlist.createdAt}>
        {setlist.items.map((song, i) => (
          <div
            key={song.id}
            style={{
              animation: "card-in 0.4s ease-out both", // 카드가 아래에서 위로 올라오면서 나타나는 애니메이션. both : 딜레이동안 from상태 유지
              animationDelay: `${i * 80}ms`,
            }}
            className="flex flex-col bg-(--color-surface) rounded-lg p-3 gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="min-w-4 text-sm font-semibold text-(--tag-key-text)">
                {i + 1}
              </span>

              <div className="flex-1">
                <p className="text-sm">{song.title}</p>
                <div className="flex flex-row text-xs text-(--color-text-secondary) mt-0.5">
                  <p className="mr-2">{song.artist}</p>
                  <span>
                    {song.number_tj
                      ? `| TJ ${song.number_tj}`
                      : song.number_ky
                        ? `| KY ${song.number_ky}`
                        : ""}
                  </span>
                </div>
              </div>
            </div>

            {song.tags.length > 0 && (
              <div className="flex flex-wrap justify-end gap-1">
                {song.tags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  if (!tag) return null;
                  const chipCategory = getTagChipCategory(tag);
                  const colorClass =
                    chipCategory === "mood"
                      ? "bg-(--tag-mood-bg) text-(--tag-mood-text)"
                      : chipCategory === "situation"
                        ? "bg-(--tag-situation-bg) text-(--tag-situation-text)"
                        : "bg-(--tag-custom-bg) text-(--tag-custom-text)";
                  return (
                    <span
                      key={tagId}
                      className={`rounded-full px-2 py-0.5 text-[11px] ${colorClass}`}
                    >
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetlistResult;
