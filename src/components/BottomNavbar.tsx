const tabs = [
  { key: "songs", label: "애창곡", icon: "ti-heart" },
  { key: "search", label: "검색", icon: "ti-search" },
  { key: "ai", label: "AI 추천", icon: "ti-sparkles" },
  { key: "setlist", label: "셋리스트", icon: "ti-dice" },
];

export type TabKey = (typeof tabs)[number]["key"];
//tabs 배열의 각 요소의 key 값만 뽑은 유니온 타입
//tabs 배열에 항목을 추가하거나 삭제하면 TabKey 타입도 자동으로 바뀜.

interface BottomNavProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}
//객체 구조를 미리 정의하여 사용

const BottomNavbar = ({ active, onChange }: BottomNavProps) => {
  return (
    <nav
      className="fixed left-1/2 transform -translate-x-1/2 bottom-0 w-full max-w-107.5 bg-(--color-navbar) 
      border-t-[0.5px] border-(--color-surface-elevated) flex justify-around items-center pt-2.5 pb-6 z-100"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer py-1 px-4"
          >
            <div
              className={`w-13 h-7 rounded-full flex items-center justify-center transition-background duration-200
              ${isActive ? "bg-[rgba(244,114,182,0.18)]" : "bg-transparent"}`}
            >
              <i
                className={`ti ${tab.icon} text-2xl transition-colors duration-200 ${
                  isActive
                    ? "text-(--color-accent)"
                    : "text-(--color-text-placeholder)"
                }`}
              />
            </div>
            <span
              className={`text-xs ${isActive ? "font-semibold text-(--color-accent)" : "font-normal text-(--color-text-placeholder)"} transition-colors duration-200`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;
