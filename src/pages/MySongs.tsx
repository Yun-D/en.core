import { useRef } from "react";
import HeroSection from "../components/HeroSection";
import StickyHeader from "../components/StickyHeader";
import EmptySongs from "./EmptySongs";

const MySongs = () => {
  const dumpData = { favsong: 0, latersong: 0 };

  const heroRef = useRef<HTMLDivElement>(null); // HeroSection의 DOM 요소 참조를 위한 ref 생성
  const onSearchClick = () => {
    // 검색 탭으로 이동하는 로직 구현 필요 (예: 라우터를 사용하여 이동)
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

      <EmptySongs onSearchClick={onSearchClick} />
    </div>
  );
};

export default MySongs;
