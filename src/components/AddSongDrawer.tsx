import { useState } from "react";
import { useTagStore } from "../store/useTagStore";
import { useSongStore } from "../store/useSongStore";
import Drawer from "./Drawer";

import { type Song } from "../type/songs";

import { useTagSelection } from "../hooks/useTagSelection";
import { TagChip } from "../components/TagChip";

interface AddSongDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editSong?: Song | null; // 수정할 곡 받기_없으면 새로 추가하는 것
}

const AddSongDrawer = ({ isOpen, onClose, editSong }: AddSongDrawerProps) => {
  const { tags } = useTagStore();
  const addSong = useSongStore((state) => state.addSong);
  const updateSong = useSongStore((state) => state.updateSong);
  const removeSong = useSongStore((state) => state.removeSong);

  const { selectedTagIds, handleToggleTag } = useTagSelection(
    editSong?.tags ?? [],
  ); // 태그 선택 상태와 토글 함수 가져오기

  const [title, setTitle] = useState(editSong?.title ?? "");
  const [artist, setArtist] = useState(editSong?.artist ?? "");
  const [tjNumber, setTjNumber] = useState(
    editSong?.number_tj ? String(editSong.number_tj) : "",
  );
  const [kyNumber, setKyNumber] = useState(
    editSong?.number_ky ? String(editSong.number_ky) : "",
  );
  const [songKey, setSongKey] = useState(editSong?.song_key ?? 0);
  const [isLater, setIsLater] = useState(editSong?.isLater ?? false);

  const [confirmDelete, setConfirmDelete] = useState(false); // 곡 삭제 확인

  //노래 데이터 템플릿
  const songData = {
    title,
    artist,
    number_tj: tjNumber ? Number(tjNumber) : undefined,
    number_ky: kyNumber ? Number(kyNumber) : undefined,
    song_key: songKey,
    tags: selectedTagIds,
    isLater,
  };

  const handleSave = () => {
    if (!title.trim() || !artist.trim()) return;

    if (editSong) {
      updateSong(editSong.id, songData);
    } else {
      addSong(songData);
    }

    setConfirmDelete(false);
    onClose();
  };

  const handleDelete = () => {
    removeSong(editSong!.id);
    onClose();
  };

  const displayKey =
    songKey === 0 ? "원곡" : songKey > 0 ? `+${songKey}` : `${songKey}`;

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      {/* 타이틀 -------------------------------------------------------- */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xl font-bold text-white">
          {editSong ? "애창곡 수정" : "애창곡 추가"}
        </span>

        <div className="flex flex-row gap-5 justify-center items-center">
          {/* 삭제버튼 ----------------------------------------------------- */}
          <div className="flex items-center gap-3">
            {editSong &&
              (confirmDelete ? (
                <button
                  onClick={handleDelete}
                  className="cursor-pointer text-xs font-semibold text-red-400 border border-red-400/40 
                    rounded-lg px-2 py-1"
                >
                  정말 삭제할까요?
                </button>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-(--color-text-placeholder) w-7 h-7"
                >
                  <i className="ti ti-trash text-lg" aria-label="삭제" />
                </button>
              ))}
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer text-(--color-text-placeholder) mr-1"
          >
            <i className="ti ti-x text-xl" />
          </button>
        </div>
      </div>

      {/* 곡명 + 가수 ----------------------------------------------------- */}
      <div className="flex-row flex items-center gap-3">
        <div className="w-20 h-20 shrink-0 rounded-xl flex items-center justify-center bg-linear-to-br from-(--color-accent) to-[#a855f7]">
          <i className="ti ti-microphone text-2xl" />
        </div>

        <div className="flex-col flex gap-2 w-full">
          <input
            type="text"
            className="w-full text-base text-white px-4 py-2 bg-(--color-surface) rounded-lg placeholder:text-(--color-text-placeholder) outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="노래 제목 *"
          />
          <input
            type="text"
            className="w-full text-sm text-white px-4 py-2 bg-(--color-surface) rounded-lg placeholder:text-(--color-text-placeholder) outline-none"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="가수 *"
          />
        </div>
      </div>

      {/* 번호 -------------------------------------------------------- */}
      <div className="flex-row flex items-center gap-5">
        <div>
          <label className="block">TJ 번호</label>
          <input
            type="number"
            className="w-full text-base text-white bg-(--color-surface) rounded-lg px-4 py-2
              placeholder:text-(--color-text-placeholder) outline-none"
            placeholder="00000"
            value={tjNumber}
            onChange={(e) => setTjNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block">KY 번호</label>
          <input
            type="number"
            className="w-full text-base text-white bg-(--color-surface) rounded-lg px-4 py-2
               placeholder:text-(--color-text-placeholder) outline-none"
            placeholder="00000"
            value={kyNumber}
            onChange={(e) => setKyNumber(e.target.value)}
          />
        </div>
      </div>

      {/* 키 -------------------------------------------------------- */}
      <div className="flex items-center gap-3 mb-1">
        <label className="text-xs text-(--color-text-muted) flex-1">키</label>
        <button
          onClick={() => setSongKey((k) => k - 1)}
          className="cursor-pointer w-8 h-8 rounded-lg bg-(--color-surface) text-white flex items-center justify-center"
        >
          <i className="ti ti-minus text-sm" />
        </button>
        <span className="text-sm font-semibold text-white min-w-10 text-center">
          {displayKey}
        </span>
        <button
          onClick={() => setSongKey((k) => k + 1)}
          className="cursor-pointer w-8 h-8 rounded-lg bg-(--color-surface) text-white flex items-center justify-center"
        >
          <i className="ti ti-plus text-sm" />
        </button>
      </div>

      {/* 태그 ------------------------------------------------------*/}
      <div>
        <div className="flex flex-col gap-2 mb-2">
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 나중에 부를 곡 토글 --------------------------------------------- */}
      <div className="flex items-center justify-between mb-5">
        <label>나중에 부를 곡</label>
        <button
          onClick={() => setIsLater((v) => !v)}
          className={`cursor-pointer w-11 h-6 rounded-full transition-colors relative 
              ${
                isLater
                  ? "bg-(--color-accent)"
                  : "bg-(--color-surface-elevated)"
              }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
              isLater ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* 저장 버튼 ---------------------------------------------------- */}
      <button
        onClick={handleSave}
        disabled={!title.trim() || !artist.trim()}
        className="cursor-pointer w-full h-12 rounded-full bg-(--color-accent) text-white 
          font-semibold text-sm disabled:opacity-40"
      >
        {editSong ? "수정" : "저장"}
      </button>
    </Drawer>
  );
};

export default AddSongDrawer;
