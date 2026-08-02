import { useSongStore } from "../store/useSongStore";
import { useTagStore } from "../store/useTagStore";
import { exportSongs } from "../utils/backup";
import Drawer from "./Drawer";

interface BackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackupDrawer = ({ isOpen, onClose }: BackupDrawerProps) => {
  const tags = useTagStore((state) => state.tags);
  const songs = useSongStore((state) => state.songs);

  const handleExport = () => {
    exportSongs();
  };

  if (!isOpen) return null;
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold">데이터 관리</h2>

      {/* ── 백업 ── */}
      <section className="flex flex-col gap-3 mt-3">
        <h3 className="text-base font-semibold ">백업</h3>
        <p className="text-sm text-(--color-text-secondary)">
          애창곡 {songs.length}곡 · 태그 {tags.length}개를 저장해요.
        </p>
        <button
          className="cursor-pointer w-full h-10 mt-2 mb-2 rounded-xl 
        bg-(--color-accent) hover:bg-(--color-accent-hover) transition-colors duration-200 px-5 py-2 text-sm font-semibold"
          onClick={handleExport}
        >
          <i className="ti ti-download mr-2" />
          파일로 저장하기
        </button>
      </section>

      <hr className="border-(--color-surface-elevated)" />

      {/* ── 복구 ── */}
      <section className="flex flex-col gap-3 mt-3">
        <h3 className="text-base font-semibold ">복구</h3>
        <p className="text-sm text-(--color-text-secondary)">
          파일로 저장한 애창곡, 태그를 불러와요.
        </p>
        <button
          className="cflex items-center justify-center gap-2 rounded-xl border border-(--color-surface-elevated) 
        px-4 py-3 text-sm font-semibold active:bg-(--color-surface-hover)"
        >
          <i className="ti ti-upload mr-2" />
          파일 선택하기
        </button>
      </section>
    </Drawer>
  );
};

export default BackupDrawer;
