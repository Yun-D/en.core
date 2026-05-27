import { useRef } from "react";
import HeroSection from "../components/HeroSection";
import StickyHeader from "../components/StickyHeader";

const MySongs = () => {
  const dumpData = { favsong: 0, latersong: 0 };

  const heroRef = useRef<HTMLDivElement>(null); // HeroSection의 DOM 요소 참조를 위한 ref 생성

  return (
    <div>
      <div ref={heroRef}>
        <HeroSection
          title="나의 애창곡"
          subtitle={`내 애창곡 ${dumpData.favsong} · 나중에 부를 곡 ${dumpData.latersong}`}
        />
      </div>

      <StickyHeader title="나의 애창곡" heroRef={heroRef} />
    </div>
  );
};

export default MySongs;
