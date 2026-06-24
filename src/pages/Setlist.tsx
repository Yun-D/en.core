import { useState } from "react";
import HeroSection from "../components/HeroSection";
import { useTagStore } from "../store/useTagStore";
import type { Song } from "../type/songs";

type SetlistMode = "random" | "choose"; // 뽑는 방식 타입
interface Setlist {
  items: Song[];
  mode: SetlistMode;
  createdAt: number;
}

const Setlist = () => {
  const [mode, setMode] = useState<SetlistMode>("random");
  const [count, setCount] = useState(5);
  const [isEditingCount, setIsEditingCount] = useState(false); // 곡 수 직접 입력 모드 토글

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [setlist, setSetlist] = useState<Setlist | null>(null); // 뽑은 셋리스트
  const hasResult = setlist !== null;

  const tags = useTagStore((state) => state.tags); // 태그 스토어에서 태그 데이터 가져오기

  // 선택모드 드로어 열기
  const handleOpenSelectPicker = () => {};

  // 랜덤모드 뽑기, 다시 뽑기
  const handleDraw = () => {
    setSetlist({
      items: [],
      mode,
      createdAt: Date.now(),
    });
  };

  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds(
      (prev) =>
        prev.includes(tagId)
          ? prev.filter((id) => id !== tagId) // 이미 있으면 제거
          : [...prev, tagId], // 없으면 추가
    );
  };

  // 곡 수 직접 입력 확정
  const handleCountInput = (value: string) => {};

  return (
    <div>
      <HeroSection
        title="셋리스트"
        subtitle={"애창곡 중 랜덤 n곡! 오늘의 셋리스트는?"}
      />

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
        <div className="flex gap-2 flex-wrap">
          {tags
            .filter((tag) => tag.category === "mood")
            .map((tag) => {
              const active = selectedTagIds.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  className={`cursor-pointer rounded-full border px-2 py-1 text-xs border-(--tag-mood-border) ${
                    active
                      ? "bg-(--tag-mood-hover-bg) text-(--tag-mood-hover-text)"
                      : "bg-(--tag-mood-bg) text-(--tag-mood-text) hover:bg-(--tag-mood-hover-bg) hover:text-(--tag-mood-hover-text)"
                  }`}
                  onClick={() => handleToggleTag(tag.id)}
                >
                  {tag.label}
                </button>
              );
            })}
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags
            .filter((tag) => tag.category === "situation")
            .map((tag) => {
              const active = selectedTagIds.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  className={`cursor-pointer rounded-full border px-2 py-1 text-xs border-(--tag-situation-border) ${
                    active
                      ? "bg-(--tag-situation-hover-bg) text-(--tag-situation-hover-text)"
                      : "bg-(--tag-situation-bg) text-(--tag-situation-text) hover:bg-(--tag-situation-hover-bg) hover:text-(--tag-situation-hover-text)"
                  }`}
                  onClick={() => handleToggleTag(tag.id)}
                >
                  {tag.label}
                </button>
              );
            })}
        </div>

        {/* 곡 수 */}
        <div className="flex justify-between items-center gap-2 mt-4 mb-5">
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
                  if (!isNaN(n) && n >= 1) setCount(n);
                  setIsEditingCount(false);
                }}
                className="w-11 bg-transparent text-center text-[15px] font-medium"
              />
            ) : (
              <button
                onClick={() => setIsEditingCount(true)}
                className="min-w-11 border-b border-dashed border-white/25 pb-0.5 text-center text-[15px] font-medium"
              >
                {count}곡
              </button>
            )}

            <button
              onClick={() => setCount((c) => c + 1)}
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
          className="cursor-pointer w-full rounded-xl bg-(--color-accent) hover:bg-[--color-accent-hover] 
          transition-colors duration-200 px-5 py-2 text-sm font-semibold text-white"
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
              <p className="text-xs">{setlist.createdAt}</p>
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
