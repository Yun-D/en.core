import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import { useTagStore } from "../store/useTagStore";
import { useSongStore } from "../store/useSongStore";
import { useSetlistStore } from "../store/useSetlistStore";
import type { SetlistMode } from "../store/useSetlistStore";
import { TagChip } from "../components/TagChip";
import { useTagSelection } from "../hooks/useTagSelection";

const STALE_THRESHOLD = 6 * 60 * 60 * 1000; // 오래된 셋리스트로 판단하는 기준(6시간)

const Setlist = () => {
  const [mode, setMode] = useState<SetlistMode>("random");
  const [count, setCount] = useState(5);
  const [isEditingCount, setIsEditingCount] = useState(false); // 곡 수 직접 입력 모드 토글

  const { selectedTagIds, handleToggleTag } = useTagSelection();

  const setlist = useSetlistStore((state) => state.setlist);
  const setSetlist = useSetlistStore((state) => state.setSetlist);

  const hasResult = setlist !== null;

  // 경과 시간 관련 ------------------------------------------------------------
  const [now, setNow] = useState(Date.now); // 리렌더링 시 값이 달라지지 않도록 렌더 밖에서 고정
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const tags = useTagStore((state) => state.tags);
  const songs = useSongStore((state) => state.songs);

  // 타임스탬프를 방금, n분전, n시간 전으로 변환
  const formatRelativeTime = (timestamp: number) => {
    const diffMin = Math.floor((now - timestamp) / 1000 / 60);

    if (diffMin < 1) return "방금";
    if (diffMin < 60) return `${diffMin}분 전`;
    return `${Math.floor(diffMin / 60)}시간 전`;
  };

  // 저장된 셋리스트가 6시간보다 오래됐는지 확인
  const isStale = setlist !== null && now - setlist.createdAt > STALE_THRESHOLD;

  // 재진입 안내문을 닫았는지 확인
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const showStaleNotice = isStale && !noticeDismissed;

  // -------------------------------------------------------------------------
  // 선택모드 드로어 열기
  const handleOpenSelectPicker = () => {};

  // 랜덤모드 뽑기, 다시 뽑기
  const handleDraw = () => {
    // 1. 태그 필터 (선택 태그 중 하나라도 가진 곡)
    const pool =
      selectedTagIds.length === 0
        ? songs
        : songs.filter((song) =>
            song.tags.some((tagId) => selectedTagIds.includes(tagId)),
          );

    // 2. songs에서 가져온 복사본을 랜덤 섞기
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // 3. count개 뽑기
    const picked = shuffled.slice(0, count);

    setSetlist({
      items: picked,
      mode,
      createdAt: Date.now(),
    });
  };

  return (
    <div>
      <HeroSection
        title="셋리스트"
        subtitle={"애창곡 중 랜덤 n곡! 오늘의 셋리스트는?"}
      />

      {showStaleNotice && setlist && (
        <div className="mb-2 rounded-xl border border-(--tag-key-text)/60 bg-(--tag-key-text)/15 p-3">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              <i className="ti ti-history mr-2 text-(--tag-key-text)" />
              {formatRelativeTime(setlist.createdAt)}에 만든 셋리스트예요.
            </p>
            <button
              onClick={() => setNoticeDismissed(true)}
              className="cursor-pointer"
            >
              <i className="ti ti-x text-lg text-(--tag-key-text)" />
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-(--color-text-placeholder)">뽑는 방식</p>
      <div className="flex flex-row items-center gap-2 mt-2">
        <ModeButton
          active={mode === "random"}
          icon="ti ti-arrows-shuffle"
          label="랜덤"
          onClick={() => setMode("random")}
        />
        <ModeButton
          active={mode === "choose"}
          icon="ti ti-list-check"
          label="선택"
          onClick={() => setMode("choose")}
        />
      </div>

      {/* 태그 */}
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-xs text-(--color-text-placeholder)">태그 (선택)</p>

        {(["mood", "situation"] as const).map((category) => (
          <div key={category} className="flex gap-2 flex-wrap">
            {tags
              .filter((tag) => tag.category === category)
              .map((tag) => (
                <TagChip
                  key={tag.id}
                  label={tag.label}
                  category={category}
                  active={selectedTagIds.includes(tag.id)}
                  onClick={() => handleToggleTag(tag.id)}
                />
              ))}
          </div>
        ))}

        {/* 곡 수 */}
        <div className="flex justify-between items-center gap-2 mt-4 mb-2">
          <p className="text-xs text-(--color-text-placeholder)">곡 수</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="cursor-pointer w-8 h-8 rounded-lg bg-(--color-surface) text-white flex items-center justify-center"
            >
              <i className="ti ti-minus text-sm" />
            </button>

            {isEditingCount ? (
              <input
                type="number"
                defaultValue={count}
                autoFocus
                onBlur={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!isNaN(n) && n >= 1) setCount(Math.min(n, songs.length));
                  setIsEditingCount(false);
                }}
                className="w-11 bg-transparent text-center text-[15px] font-medium"
              />
            ) : (
              <button
                onClick={() => setIsEditingCount(true)}
                className="min-w-11 border-b border-dashed border-(--color-accent)/80 pb-0.5 text-center text-[15px] font-medium"
              >
                {count}곡
              </button>
            )}

            <button
              onClick={() => setCount((c) => Math.min(songs.length, c + 1))}
              className="cursor-pointer w-8 h-8 rounded-lg bg-(--color-surface) text-white flex items-center justify-center"
            >
              <i className="ti ti-plus text-sm" />
            </button>
          </div>
        </div>

        {/* 뽑기, 다시 뽑기 버튼 */}
        {/* random 모드 : 랜덤 뽑기 // choose 모드 : 선택 드로어 열기 */}
        <button
          onClick={mode === "choose" ? handleOpenSelectPicker : handleDraw}
          className="cursor-pointer w-full rounded-xl bg-(--color-accent) hover:bg-(--color-accent-hover) 
          transition-colors duration-200 px-5 py-2 text-sm font-semibold"
        >
          <i
            className={`ti ${hasResult ? "ti-refresh" : "ti-arrows-shuffle"} text-[15px] mr-2`}
          />
          {mode === "choose" ? "곡 선택하기" : hasResult ? "다시 뽑기" : "뽑기"}
        </button>

        {hasResult && setlist && (
          <div className="mt-4 border-t border-dashed border-(--color-surface-elevated) pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-(--color-text-placeholder)">
                오늘의 셋리스트 - {setlist.items.length}곡
              </p>
              <p className="text-xs text-(--color-text-placeholder)">
                {formatRelativeTime(setlist.createdAt)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {setlist.items.map((song, i) => (
                <div
                  key={song.id}
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
                        const colorClass =
                          tag.category === "mood"
                            ? "bg-(--tag-mood-bg) text-(--tag-mood-text)"
                            : tag.category === "situation"
                              ? "bg-(--tag-situation-bg) text-(--tag-situation-text)"
                              : "bg-(--color-surface-elevated) text-(--color-text-secondary)";
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
        )}
      </div>
    </div>
  );
};

interface ModeButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

const ModeButton = ({ active, icon, label, onClick }: ModeButtonProps) => {
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

export default Setlist;
