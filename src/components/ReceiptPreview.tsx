import type { Ref } from "react";
import type { Song } from "../type/songs";
import { formatDate, formatTime } from "../utils/time";

interface ReceiptPreviewProps {
  songs: Song[];
  singers: string;
  enteredAt: number;
  mvpId: number | null;
  innerRef?: Ref<HTMLDivElement>; // 이미지로 캡처할 대상
}

const ReceiptPreview = ({
  songs,
  singers,
  enteredAt,
  mvpId,
  innerRef,
}: ReceiptPreviewProps) => {
  const mvp = songs.find((song) => song.id === mvpId);

  return (
    <div
      ref={innerRef}
      className="w-85 shrink-0 bg-[#FAF9F6] px-7 py-8 font-mono text-[#1A1A1A]"
    >
      {/* 헤더 -------------  */}
      <p className="text-center text-2xl tracking-[0.25em]">EN.CORE</p>
      <p className="mt-1 text-center text-xs tracking-[0.4em]">앵콜 노래방</p>
      <p className="mt-2 text-center text-xs tracking-[0.15em] text-[#6B6B6B]">
        * 오늘의 노래 정산서 *
      </p>

      <Divider bold />
      <Row label="일자" value={formatDate(enteredAt)} />
      <Row label="입실" value={formatTime(enteredAt)} />
      <Row label="가수" value={singers} />

      {/* 곡 목록 ---------- */}
      <Divider />
      <div className="flex justify-between text-sm text-[#4A4A4A]">
        <span>곡 목록</span>
      </div>
      <Divider />

      <ol className="flex flex-col gap-4">
        {songs.map((song, i) => (
          <li key={song.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] leading-tight">
                <span>{String(i + 1).padStart(2, "0")}.</span> {song.title}
                {song.id === mvpId && " ★"}
              </p>
              <p className="mt-1 pl-7 text-xs text-[#7A7A7A]">{song.artist}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 합계 ---------- */}
      <Divider bold />
      <Row label="합계 곡 수" value={`${songs.length} 곡`} />
      {mvp && <Row label="오늘의 MVP" value={`${mvp.title} ♪`} strong />}

      {/* 바코드 ---------- */}
      <Divider />
      <div className="flex justify-center gap-1 py-1" aria-hidden>
        {BAR_WIDTHS.map((width, i) => (
          <span
            key={i}
            style={{ width, height: 44, backgroundColor: "#1A1A1A" }}
          />
        ))}
      </div>

      <p className="mt-2 text-center text-xs tracking-[0.2em] text-[#4A4A4A]">
        ENCORE {formatTime(enteredAt).replace(":", "")}
      </p>

      <p className="mt-5 text-center text-xs tracking-[0.15em] text-[#4A4A4A]">
        * 이용해주셔서 감사합니다 *
      </p>
      <p className="mt-1 text-center text-xs text-[#7A7A7A]">
        다음에 또 앵콜 ♪
      </p>
    </div>
  );
};

// 바코드 막대 굵기 (장식용이라 고정값)
const BAR_WIDTHS = [
  2, 5, 3, 2, 7, 3, 5, 2, 3, 7, 2, 5, 3, 2, 7, 5, 2, 3, 5, 7, 2, 3,
];

const Row = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div
    className={`flex justify-between py-1 text-[15px] ${strong ? "font-bold" : ""}`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const Divider = ({ bold }: { bold?: boolean }) => (
  <div
    className="my-4"
    style={{ borderTop: `${bold ? 2 : 1}px dashed #C9C5BC` }}
  />
);

export default ReceiptPreview;
