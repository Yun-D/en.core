import { useState } from "react";
import { useSongStore } from "../store/useSongStore";
import { type Song } from "../type/songs";
import Drawer from "./Drawer";

interface SetlistPickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (songs: Song[]) => void; // 고른 곡들을 부모(Setlist)에게 순서대로 전달
  initialSelectedIds?: number[]; // '이어서 하기'용 :: 초기 선택된 곡들의 ID 배열 (선택된 곡이 없으면 undefined)
}

const SetlistPickerDrawer = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedIds,
}: SetlistPickerDrawerProps) => {
  const songs = useSongStore((state) => state.songs);

  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialSelectedIds ?? [],
  ); // 선택된 곡 id들(배열 순서가 셋리스트 순서)

  // 곡 선택/해제 토글 함수
  const handleToggle = (songId: number) => {
    setSelectedIds(
      (prev) =>
        prev.includes(songId)
          ? prev.filter((id) => id !== songId) // 선택 해제(빼기)
          : [...prev, songId], // 선택 추가(뒤에 붙이기)
    );
  };

  // 확인 버튼 클릭 시 선택된 곡들을 부모(Setlist)에게 전달
  const handleConfirm = () => {
    const pickedSongs = selectedIds
      .map((id) => songs.find((song) => song.id === id)) // id에 해당하는 실제 곡 객체 찾기
      .filter((song): song is Song => song !== undefined); // undefined 제거 // 타입 가드로 Song[]로 변환

    onConfirm(pickedSongs); // 부모에게 선택된 곡 전달
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold text-white">셋리스트 곡 선택</span>
        <span className="text-sm text-(--color-text-placeholder)">
          {selectedIds.length}곡 선택됨
        </span>
      </div>

      <div
        className="flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto
      scrollbar-thin scrollbar-thumb-(--color-surface-elevated) scrollbar-track-transparent"
      >
        {songs.length === 0 ? (
          <p className="text-(--color-text-placeholder) text-sm text-center py-8">
            저장된 애창곡이 없어요. <br />
            검색이나 직접 등록을 통해 곡을 추가해보세요.
          </p>
        ) : (
          songs.map((song) => {
            const order = selectedIds.indexOf(song.id); // 선택된 곡이면 순서(0부터 시작), 아니면 -1(미선택)
            const isSelected = order !== -1;

            return (
              <button
                key={song.id}
                onClick={() => handleToggle(song.id)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-left"
              >
                {/* 체크 버튼 ------- 선택 시 순서 번호, 아니면 빈 동그라미 */}
                {isSelected ? (
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full 
                  bg-(--tag-key-text) text-(--color-surface) text-xs font-semibold"
                  >
                    {order + 1}
                  </span>
                ) : (
                  <span className="w-6 h-6 shrink-0 rounded-full border border-(--color-surface-elevated)" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{song.title}</p>
                  <p className="text-xs text-(--color-text-placeholder)">
                    {song.artist}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* 확정 버튼 ------- */}
      <button
        onClick={handleConfirm}
        disabled={selectedIds.length === 0}
        className="cursor-pointer w-full h-10 mt-2 rounded-xl bg-(--color-accent) font-semibold text-white
        hover:bg-(--color-accent-hover) transition-colors duration-200 px-5 py-2 text-sm mb-2
        disabled:opacity-40 disabled:cursor-not-allowed"
      >
        이 곡들로 셋리스트 만들기
      </button>
    </Drawer>
  );
};

export default SetlistPickerDrawer;
