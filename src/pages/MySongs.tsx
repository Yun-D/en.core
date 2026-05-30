import { useRef } from "react";
import HeroSection from "../components/HeroSection";
import StickyHeader from "../components/StickyHeader";
import EmptySongs from "./EmptySongs";
import { useTagStore } from "../store/useTagStore";

const MySongs = () => {
  const dumpData = { favsong: 0, latersong: 0 };

  const heroRef = useRef<HTMLDivElement>(null); // HeroSection의 DOM 요소 참조를 위한 ref 생성
  const tags = useTagStore((state) => state.tags); // 태그 스토어에서 태그 데이터 가져오기

  //TODO: 실제 데이터에 따라 isEmpty 판단 로직 수정 필요
  const isEmpty = dumpData.favsong === 0 && dumpData.latersong === 0; // 저장된 곡이 없는지 여부 판단
  const onSearchClick = () => {
    // TODO: 검색 탭으로 이동하는 로직 구현 필요 (예: 라우터를 사용하여 이동)
  };

  return (
    <div>
      <div ref={heroRef}>
        <HeroSection
          title="나의 애창곡"
          subtitle={`내 애창곡 ${dumpData.favsong} · 나중에 부를 곡 ${dumpData.latersong}`}
        />
      </div>
      <StickyHeader title="나의 애창곡" heroRef={heroRef} />

      {/* 검색창 + 태그 영역 (곡이 없는 경우 비활성화) ------------------------------------------------ */}
      <div
        className={` flex flex-col ${isEmpty ? "opacity-30 pointer-events-none" : ""}`}
      >
        {/* 검색창 */}
        <div
          className="flex items-center gap-2 border border-(--color-surface-elevated) rounded-xl 
        bg-(--color-surface) px-4 py-2"
        >
          <i className="ti ti-search text-(--color-text-placeholder)" />
          <input
            type="text"
            className="text-sm outline-none w-full"
            placeholder="곡 제목이나 가수로 검색해보세요"
          />
        </div>

        {/* 태그 */}
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex gap-2 flex-wrap">
            {tags
              .filter((tag) => tag.category === "mood")
              .map((tag) => (
                <button
                  key={tag.id}
                  className="cursor-pointer rounded-full border border-(--tag-mood-border) bg-(--tag-mood-bg) text-(--tag-mood-text) 
                  px-2 py-1 text-xs"
                >
                  {tag.label}
                </button>
              ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags
              .filter((tag) => tag.category === "situation")
              .map((tag) => (
                <button
                  key={tag.id}
                  className="cursor-pointer rounded-full border border-(--tag-situation-border) bg-(--tag-situation-bg) text-(--tag-situation-text) 
                  px-2 py-1 text-xs"
                >
                  {tag.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {isEmpty && <EmptySongs onSearchClick={onSearchClick} />}
    </div>
  );
};

export default MySongs;
