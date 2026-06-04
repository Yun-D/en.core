import { useRef, useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import StickyHeader from "../components/StickyHeader";
import EmptySongs from "./EmptySongs";
import { useTagStore } from "../store/useTagStore";
import AddSongDrawer from "../components/AddSongDrawer";
import { useSongStore } from "../store/useSongStore";
import SongCard from "../components/SongCard";

const MySongs = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 곡 추가 드로어의 열림 상태 관리

  const heroRef = useRef<HTMLDivElement>(null); // HeroSection의 DOM 요소 참조를 위한 ref 생성
  const tags = useTagStore((state) => state.tags); // 태그 스토어에서 태그 데이터 가져오기
  const songs = useSongStore((state) => state.songs); // 곡 스토어에서 곡 데이터 가져오기

  const isEmpty = songs.length === 0; // 저장된 곡이 없는지 여부 판단

  useEffect(() => {
    document.body.style.overflow = isEmpty ? "hidden" : ""; // 곡이 없을 때는 스크롤 잠금, 있으면 해제
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEmpty]);

  const onSearchClick = () => {
    // TODO: 검색 탭으로 이동하는 로직 구현 필요 (예: 라우터를 사용하여 이동)
  };
  const onAddClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div>
      <div ref={heroRef}>
        <HeroSection
          title="나의 애창곡"
          subtitle={`내 애창곡 ${songs.length} · 나중에 부를 곡 ${songs.filter((song) => song.isLater).length}`}
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
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-xs text-(--color-text-placeholder)">분위기</p>
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
          <p className="text-xs text-(--color-text-placeholder) mt-2">상황</p>
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

        <div className="flex justify-between mt-8 items-center">
          <span className="text-base">나의 애창곡</span>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1 text-sm text-(--color-text-placeholder) border border-(--color-surface-elevated) rounded-lg px-3 py-1"
          >
            <i className="ti ti-plus text-xs" />곡 추가
          </button>
        </div>
      </div>

      {/* 곡리스트  ------------------------------------------------ */}
      <div className="flex flex-col gap-2 mt-3 ">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      {isEmpty && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pb-20 pt-68">
          <EmptySongs onSearchClick={onSearchClick} onAddClick={onAddClick} />
        </div>
      )}

      <AddSongDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default MySongs;
