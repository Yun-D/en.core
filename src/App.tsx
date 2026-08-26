import { useState } from "react";
import BottomNavbar, { type TabKey } from "./components/BottomNavbar";
import MySongs from "./pages/MySongs";
import SongSearch from "./pages/SongSearch";
import Setlist from "./pages/Setlist";

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("songs");

  //각 탭 키에 해당하는 페이지 컴포넌트를 매핑
  const pages: Record<TabKey, React.ReactNode> = {
    songs: <MySongs onTabChange={setActiveTab} />,
    search: <SongSearch />,
    setlist: <Setlist />,
  };

  return (
    <div className="flex max-w-107.5 flex-col mx-auto h-dvh bg-(--color-bg) wrap-break-word">
      <main
        className="flex-1 overflow-y-auto overscroll-contain px-5 pt-[env(safe-area-inset-top)]
    scrollbar-thin scrollbar-thumb-(--color-surface-elevated) scrollbar-track-transparent"
      >
        {pages[activeTab]} {/* 동적 페이지 렌더링 */}
      </main>
      <BottomNavbar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
