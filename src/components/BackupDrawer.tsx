import { useRef, useState } from "react";
import { useSongStore } from "../store/useSongStore";
import { useTagStore } from "../store/useTagStore";
import {
  exportSongs,
  readBackupFile,
  type ExportedData,
} from "../utils/backup";
import Drawer from "./Drawer";
import { AccentButton } from "./AccentButton";

interface BackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// 복구(import) 단계 화면 상태들.
// idle: 아무것도 안함, ready: 파일 선택됨, invalid: 파일이 유효하지 않음, done: 복구 완료
type ImportPhase = "idle" | "ready" | "invalid" | "done";

interface ImportPreview {
  fileName: string;
  songCount: number;
  tagCount: number;
}

const BackupDrawer = ({ isOpen, onClose }: BackupDrawerProps) => {
  const tags = useTagStore((state) => state.tags);
  const songs = useSongStore((state) => state.songs);

  // 복구 시 스토어 통째로 덮어쓸 액션
  const setSongs = useSongStore((state) => state.setSongs);
  const setTags = useTagStore((state) => state.setTags);

  // 숨겨둔 <input type="file" />를 클릭시키기 위해 ref 생성
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importPhase, setImportPhase] = useState<ImportPhase>("idle");
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [importedCount, setImportedCount] = useState(0); // done 화면에 보여줄 불러온 곡 수

  // 검증 통과 원본을 덮어쓰기 확정 전까지 들고있는 자리
  const [pendingBackup, setPendingBackup] = useState<ExportedData | null>(null);

  const handleExport = () => {
    exportSongs();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const backup = await readBackupFile(file);
      setPendingBackup(backup);
      setImportPreview({
        fileName: file.name,
        songCount: backup.songs.length,
        tagCount: backup.tags.length,
      });
      setImportPhase("ready");
    } catch (error) {
      // readBackupFile에서 throw한 에러 메시지를 그대로 보여줌
      setErrorMessage(
        error instanceof Error ? error.message : "파일을 불러오지 못했어요.",
      );
      setImportPhase("invalid");
    }
  };

  const handleConfirmImport = () => {
    if (!pendingBackup) return; // 안전장치 : 보관된 게 없으면 중단

    setSongs(pendingBackup.songs);
    setTags(pendingBackup.tags);

    setImportedCount(pendingBackup.songs.length);
    setImportPhase("done");
  };

  const resetImportState = () => {
    setImportPhase("idle");
    setImportPreview(null);
    setErrorMessage("");
    setImportedCount(0);
    setPendingBackup(null);

    // 같은 파일을 다시 골라도 onChange 이벤트가 발생하도록 input.value 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 닫을 때 복구 진행 상태도 초기화
  const handleClose = () => {
    resetImportState();
    onClose();
  };

  if (!isOpen) return null;
  return (
    <Drawer isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-bold">데이터 관리</h2>

      {/* ── 백업 ── */}
      <section className="flex flex-col gap-3 mt-3">
        <h3 className="text-base font-semibold ">백업</h3>
        <p className="text-sm text-(--color-text-secondary)">
          애창곡 {songs.length}곡 · 태그 {tags.length}개를 저장해요.
        </p>

        <AccentButton
          onClick={handleExport}
          icon="ti-download"
          text="파일로 저장하기"
        />
      </section>

      <hr className="border-(--color-surface-elevated)" />

      {/* ── 복구 ── */}
      <section className="flex flex-col gap-3 mt-3">
        <h3 className="text-base font-semibold">복구</h3>
        <p className="text-sm text-(--color-text-secondary)">
          파일로 저장한 애창곡, 태그를 불러와요.
        </p>

        {/* 실제 파일 입력은 숨기고 버튼 클릭 시 숨겨둔 <input type="file" />를 클릭시키는 방식으로 구현 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* idle == 파일 선택 시 */}
        {importPhase === "idle" && (
          <button
            className="flex items-center justify-center gap-2 rounded-xl border border-(--color-surface-elevated) 
        px-4 py-3 text-sm font-semibold active:bg-(--color-surface-hover)"
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="ti ti-upload mr-1" aria-hidden="true" />
            파일 선택하기
          </button>
        )}

        {/* ready == 검증 통과 시 요약 및 덮어쓰기 경고 */}
        {importPhase === "ready" && importPreview && (
          <div className="flex flex-col gap-3 rounded-xl bg-(--color-surface-hover) p-4">
            <div>
              <p className="text-sm font-semibold mb-1.5">
                선택한 파일: {importPreview.fileName}
              </p>
              <p className="text-sm">
                애창곡 {importPreview.songCount}곡 · 태그{" "}
                {importPreview.tagCount}개를 찾았어요.
              </p>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-(--tag-situation-text)">
              <i className="ti ti-alert-triangle text-base shrink-0 mr-1" />
              <span>
                불러오면 지금 저장된 애창곡이 이 파일 내용으로 바뀌어요.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetImportState}
                className="cursor-pointer flex-1 rounded-xl border border-(--color-text-placeholder) px-4 py-2.5 text-sm
                    hover:bg-(--color-surface) transition-colors duration-200"
              >
                취소
              </button>
              <button
                onClick={handleConfirmImport}
                className="cursor-pointer flex-1 rounded-xl bg-(--color-danger) px-4 py-2.5 text-sm
                    hover:bg-(--color-danger-hover) transition-colors duration-200"
              >
                덮어쓰기
              </button>
            </div>
          </div>
        )}

        {/* invalid == 검증 실패 시 에러 메시지 표시 */}
        {importPhase === "invalid" && (
          <div className="flex flex-col gap-3 rounded-xl bg-(--color-danger-soft) p-4">
            <div className="flex items-start gap-0.5 text-xs text-(--color-danger-text)">
              <i className="ti ti-alert-triangle text-base shrink-0" />
              <span>{errorMessage || "앵콜 백업 파일이 아니에요."}</span>
            </div>

            <button
              onClick={resetImportState}
              className="cursor-pointer self-end rounded-xl bg-(--color-accent) px-4 py-2.5 text-sm
                    hover:bg-(--color-accent-hover) transition-colors duration-200"
            >
              다시 선택하기
            </button>
          </div>
        )}

        {/* done == 복구 완료 시 완료 메시지 표시 */}
        {importPhase === "done" && (
          <div className="flex flex-col gap-3 rounded-xl bg-(--color-surface-hover) p-4">
            <div className="flex items-start gap-0.5 text-xs">
              <i className="ti ti-check text-lg shrink-0 mr-1" />
              <span>
                {importedCount}곡을 불러왔어요. 이제 애창곡 목록에서
                확인해보세요.
              </span>
            </div>

            <button
              onClick={handleClose}
              className="cursor-pointer self-end rounded-xl bg-(--color-accent) px-4 py-2.5 text-sm
                    hover:bg-(--color-accent-hover) transition-colors duration-200"
            >
              완료
            </button>
          </div>
        )}
      </section>
    </Drawer>
  );
};

export default BackupDrawer;
