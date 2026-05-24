import { useState } from "react";
import BottomNavbar, { type TabKey } from "./components/BottomNavbar";
// import GoToSong from "./pages/GoToSong";

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("songs");

  return (
    <div className="max-w-107.5 mx-auto min-h-screen bg-(--color-bg)">
      {/* <GoToSong /> */}
      <BottomNavbar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
