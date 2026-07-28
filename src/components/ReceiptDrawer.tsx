import Drawer from "./Drawer";
import type { Setlist } from "../store/useSetlistStore";
import { useRef, useState } from "react";
import { formatDateTimeLocal } from "../utils/time";
import ReceiptPreview from "./ReceiptPreview";
import { saveReceiptImage } from "../utils/saveReceiptImage";

interface ReceiptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setlist: Setlist;
}

const ReceiptDrawer = ({ isOpen, onClose, setlist }: ReceiptDrawerProps) => {
  // form: 정보 입력 단계 / preview: 완성된 영수증 확인 단계
  const [step, setStep] = useState<"form" | "preview">("form");

  // 입실 시간 (기본값은 셋리스트 만든 시각)
  const [enteredAt, setEnteredAt] = useState(setlist.createdAt);

  // 오늘의 MVP 지정 곡 id(없으면 null)
  const [mvpId, setMvpId] = useState<number | null>(null);
  const handleToggleMvp = (songId: number) => {
    setMvpId((prev) => (prev === songId ? null : songId));
  };

  const [singers, setSingers] = useState<string>("");

  const receiptRef = useRef<HTMLDivElement>(null); // 이미지로 캡처할 DOM 요소를 가리킬 ref
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    if (!receiptRef.current || isSaving) return;

    setIsSaving(true);
    try {
      await saveReceiptImage(receiptRef.current, `encore-${Date.now()}.png`);
    } catch (error) {
      console.error(error);
      alert("이미지를 만들지 못했어요. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      {step === "form" ? (
        <>
          <div className="text-center mb-2">
            <p className="text-xl font-bold">오늘의 정산</p>
            <p className="mt-1 text-sm text-(--color-text-placeholder)">
              오늘의 MVP 곡을 골라보세요
            </p>
          </div>

          {/* 입실 시간 ---------- */}
          <div className="flex items-center justify-between rounded-lg bg-(--color-surface) px-4 py-3">
            <label
              htmlFor="enteredAt"
              className="text-sm text-(--color-text-placeholder)"
            >
              입실 일시
            </label>
            <input
              id="enteredAt"
              type="datetime-local"
              value={formatDateTimeLocal(enteredAt)}
              onChange={(e) => setEnteredAt(new Date(e.target.value).getTime())}
              className="ml-auto w-fit cursor-pointer bg-transparent text-sm"
            />
          </div>

          {/* 가수 입력 ---------- */}
          <div className="flex items-center justify-between rounded-lg bg-(--color-surface) px-4 py-3">
            <label
              htmlFor="singers"
              className="text-sm text-(--color-text-placeholder)"
            >
              가수
            </label>
            <input
              id="singers"
              type="text"
              value={singers}
              onChange={(e) => setSingers(e.target.value)}
              className="cursor-pointer bg-transparent text-base min-w-40 
              border-b border-dashed border-(--color-text-placeholder) pb-0.5"
            />
          </div>

          {/* 곡 목록 + MVP 선택 ---------- */}
          <div
            className="flex flex-col max-h-[35vh] overflow-y-auto rounded-lg bg-(--color-surface)
            scrollbar-thin scrollbar-thumb-(--color-surface-elevated) scrollbar-track-transparent"
          >
            {setlist.items.map((song) => {
              const isMvp = song.id === mvpId;

              return (
                <button
                  key={song.id}
                  onClick={() => handleToggleMvp(song.id)}
                  aria-pressed={isMvp} // 눌린 상태 접근성 알림
                  aria-label={`${song.title}을 오늘의 MVP로 지정`}
                  className="cursor-pointer flex items-center gap-3 px-4 py-3 text-left"
                >
                  <i
                    className={`text-lg ${
                      isMvp
                        ? "ti ti-star-filled text-(--tag-key-text)"
                        : "ti ti-star text-white/30"
                    }`}
                  />
                  <p className="min-w-0 flex-1 truncate text-sm">
                    {song.title}
                    <span className="ml-1.5 text-xs text-(--color-text-placeholder)">
                      {song.artist}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep("preview")}
            className="cursor-pointer w-full h-10 mt-2 mb-2 rounded-xl bg-(--color-accent) 
            hover:bg-(--color-accent-hover) transition-colors duration-200 
            px-5 py-2 text-sm font-semibold"
          >
            영수증 만들기
          </button>
        </>
      ) : (
        <>
          <div
            className="flex justify-center items-start max-h-[55vh] overflow-y-auto
        crollbar-thin scrollbar-thumb-(--color-surface-elevated) scrollbar-track-transparent"
            style={{
              animation:
                "receipt-drop 0.5s cubic-bezier(0.34, 1.56, 0.67, 1) both",
            }}
          >
            <ReceiptPreview
              songs={setlist.items}
              singers={singers}
              enteredAt={enteredAt}
              mvpId={mvpId}
              innerRef={receiptRef}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer w-full h-10 mt-2 rounded-xl bg-(--color-accent) 
            hover:bg-(--color-accent-hover) transition-colors duration-200 
            px-5 py-2 text-sm font-semibold text-white
            disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? "저장 중..." : "이미지 저장하기"}
          </button>

          <button
            onClick={() => setStep("form")}
            className="cursor-pointer w-full h-10 rounded-xl bg-(--color-surface) 
            text-white/70 hover:text-white transition-colors duration-200 px-5 py-2 text-sm"
          >
            수정하기
          </button>
        </>
      )}
    </Drawer>
  );
};

export default ReceiptDrawer;
