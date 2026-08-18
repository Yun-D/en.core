import { useRef, useEffect, useState, useMemo } from "react";
import HeroSection from "../components/HeroSection";
import StickyHeader from "../components/StickyHeader";
import EmptySongs from "../components/EmptySongs";
import { useTagStore } from "../store/useTagStore";
import AddSongDrawer from "../components/AddSongDrawer";
import { useSongStore } from "../store/useSongStore";
import SavedSongCard from "../components/SavedSongCard";
import type { Song } from "../type/songs";
import type { TabKey } from "../components/BottomNavbar";

import { useTagSelection } from "../hooks/useTagSelection";
import { TagChip } from "../components/TagChip";
import BackupDrawer from "../components/BackupDrawer";

interface MySongsProps {
  onTabChange: (tab: TabKey) => void;
}

const MySongs = ({ onTabChange }: MySongsProps) => {
  const [isAddSongOpen, setIsAddSongOpen] = useState(false); // 곡 추가 드로어의 열림 상태 관리
  const [isBackupOpen, setIsBackupOpen] = useState(false); // 백업 드로어 열림 상태 관리
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const { selectedTagIds, handleToggleTag } = useTagSelection(); // 태그 선택 상태와 토글 함수 가져오기
  const [query, setQuery] = useState(""); // 검색어 상태 관리
  const [onlyLater, setOnlyLater] = useState(false); // '나중에' 필터 여부 (song.isLater에서 파생되는 값이라 태그로 저장하지 않음)

  const preListRef = useRef<HTMLDivElement>(null); // 곡 리스트가 나오기 전의 DOM 요소 참조를 위한 ref 생성
  const tags = useTagStore((state) => state.tags); // 태그 스토어에서 태그 데이터 가져오기
  const songs = useSongStore((state) => state.songs); // 곡 스토어에서 곡 데이터 가져오기

  const isEmpty = songs.length === 0; // 저장된 곡이 없는지 여부 판단

  // 선택된 태그에 맞는 곡만 필터링 (선택된 태그가 없으면 전체 곡 표시)
  const filteredSongs = useMemo(() => {
    let list = songs;

    if (onlyLater) list = list.filter((song) => song.isLater); // '나중에' 칩이 켜져 있으면 나중에 부를 곡만

    if (selectedTagIds.length > 0) {
      list = list.filter((song) =>
        selectedTagIds.every((tagId) => song.tags.includes(tagId)),
      );
    }

    return list;
  }, [songs, selectedTagIds, onlyLater]);

  const searchedSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredSongs; // 검색어가 없으면 필터링된 곡 그대로 반환

    return filteredSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q),
    );
  }, [filteredSongs, query]);

  useEffect(() => {
    document.body.style.overflow = isEmpty ? "hidden" : ""; // 곡이 없을 때는 스크롤 잠금, 있으면 해제
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEmpty]);

  const handleSearchClick = () => {
    onTabChange("search"); // 검색 탭으로 이동
  };
  const handleAddClick = () => {
    setEditingSong(null); // 곡 추가모드
    setIsAddSongOpen(true);
  };

  const handleEditClick = (song: Song) => {
    setEditingSong(song); // 수정모드
    setIsAddSongOpen(true);
  };

  return (
    <div>
      <div ref={preListRef}>
        <HeroSection
          title="나의 애창곡"
          subtitle={`내 애창곡 ${songs.length} · 나중에 부를 곡 ${songs.filter((song) => song.isLater).length}`}
          action={
            <button
              onClick={() => setIsBackupOpen(true)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full
            active:bg-(--color-surface-hover)"
            >
              <i className="ti ti-dots" />
            </button>
          }
        />

        <StickyHeader title="나의 애창곡" preListRef={preListRef}>
          <button
            onClick={handleAddClick}
            className="cursor-pointer flex items-center gap-1 text-sm text-(--color-text-primary) 
            border border-(--color-text-primary) rounded-lg px-3 py-1"
          >
            <i className="ti ti-plus text-xs" />곡 추가
          </button>
        </StickyHeader>

        {/* 검색창 + 태그 영역 (곡이 없는 경우 비활성화) ------------------------------------------------ */}
        <div
          className={`flex flex-col ${isEmpty ? "opacity-30 pointer-events-none" : ""}`}
        >
          {/* 검색창 */}
          <div
            className="flex items-center gap-2 border border-(--color-surface-elevated) rounded-xl 
        bg-(--color-surface) px-4 py-2"
          >
            <i className="ti ti-search text-(--color-text-placeholder)" />
            <input
              type="text"
              className="text-base outline-none w-full"
              placeholder="곡 제목이나 가수로 검색해보세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* 태그 */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col gap-2 mt-4">
              {(["mood", "situation"] as const).map((category) => (
                <div key={category} className="flex flex-col gap-2">
                  <p className="text-xs text-(--color-text-placeholder)">
                    {category === "mood" ? "분위기" : "상황"}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {tags
                      .filter((tag) => tag.category === category)
                      .map((tag) => (
                        <TagChip
                          key={tag.id}
                          label={tag.label}
                          category={category}
                          active={selectedTagIds.includes(tag.id)}
                          onClick={() => handleToggleTag(tag.id)}
                        />
                      ))}

                    {/* '나중에'는 저장된 태그가 아니라 song.isLater에서 파생된 필터용 칩 */}
                    {category === "situation" && (
                      <TagChip
                        label="나중에"
                        category="later"
                        active={onlyLater}
                        onClick={() => setOnlyLater((prev) => !prev)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8 items-center">
            <span className="text-base">나의 애창곡</span>
            <button
              onClick={handleAddClick}
              className="cursor-pointer flex items-center gap-1 text-sm text-(--color-text-placeholder) border border-(--color-surface-elevated) rounded-lg px-3 py-1"
            >
              <i className="ti ti-plus text-xs" />곡 추가
            </button>
          </div>
        </div>
      </div>

      {/* 곡리스트  ------------------------------------------------ */}
      <div className="flex flex-col gap-2 mt-3 ">
        {searchedSongs.map((song) => (
          <SavedSongCard
            key={song.id}
            song={song}
            onClick={() => handleEditClick(song)}
          />
        ))}
      </div>

      {isEmpty && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pb-20 pt-68">
          <EmptySongs
            onSearchClick={handleSearchClick}
            onAddClick={handleAddClick}
          />
        </div>
      )}

      <AddSongDrawer
        key={editingSong?.id ?? "new"} // key가 바뀌면 새로 마운트되어 useState 초기값 다시 계산됨(추가 모드의 경우 'new', 수정 모드의 경우 각 곡의 id가 key가 됨)
        isOpen={isAddSongOpen}
        onClose={() => setIsAddSongOpen(false)}
        editSong={editingSong}
      />

      <BackupDrawer
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  );
};

export default MySongs;
