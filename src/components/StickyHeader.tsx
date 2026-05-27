import { useEffect, useState, type RefObject } from "react";

type StickyHeaderProps = {
  title: string;
  heroRef: RefObject<HTMLDivElement | null>; // HeroSection의 ref 전달받음(기본값은 null도 가능하도록 설정)
  children?: React.ReactNode; // 필터칩 등 추가 가능하도록 children 허용
};
const StickyHeader = ({ title, heroRef, children }: StickyHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return; // HeroSection의 DOM 요소가 없을 때 스티키 헤더 보이도록

    const observer = new IntersectionObserver(
      // HeroSection이 뷰포트에서 사라지는지 감지하는 옵저버. 화면에 보이면 isVisible을 false로, 사라지면 true로 설정
      ([entry]) => setIsVisible(!entry.isIntersecting),
    );

    observer.observe(heroRef.current); // 히어로섹션 감시 시작

    return () => observer.disconnect(); // 컴포넌트 사라질 때 옵저버 정리
  }, [heroRef]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 mx-auto h-14 w-full max-w-107.5 bg-(--color-surface) px-5 flex items-center justify-between transition-opacity duration-200
    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <span className="text-[18px] font-semibold text-(--color-text)">
        {title}
      </span>
      {children}
    </div>
  );
};

export default StickyHeader;
