import { useEffect, type ReactNode } from "react";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div>
      {/* 배경 딤 처리 + 바깥 클릭 시 닫기 */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* 드로어 본체*/}
      <div
        className="fixed bottom-0 left-0 right-0 z-300 max-w-107.5 mx-auto bg-(--color-navbar) 
        rounded-t-2xl px-5 pb-15 flex flex-col gap-3 pt-2"
      >
        {/* 핸들 */}
        <div className="w-9 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-3" />

        {children}
      </div>
    </div>
  );
};

export default Drawer;
