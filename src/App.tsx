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
    <div className="max-w-107.5 mx-auto min-h-screen bg-(--color-bg) px-5 pb-24 wrap-break-word overflow-hidden">
      {pages[activeTab]} {/* 동적 페이지 렌더링 */}
      <BottomNavbar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
