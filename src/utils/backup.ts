import { useSongStore } from "../store/useSongStore";
import { useTagStore } from "../store/useTagStore";

import { type Song } from "../type/songs";
import { type Tag } from "../type/tags";

/*
1. store에서 백업할 songs, tags 가져오기
2. 원본과 메타정보(백업 시점, 버전)를 묶기
3. 객체 -> JSON 문자열
4. 문자열을 메모리상의 JSON타입의 파일(Blob)로 변환
5. 그 Blob을 가리키는 임시 URL 생성
6. URL을 <a> 태그에 넣고 다운로드 링크로 세팅한 뒤 코드로 클릭(다운로드)
7. 뒷정리: URL.revokeObjectURL()로 메모리 해제
*/

export const exportSongs = () => {
  // 1. store에서 백업할 songs, tags 가져오기
  const songStore = useSongStore.getState(); // getState()로 지금 이 순간의 값을 한 번 읽어옴
  const tagStore = useTagStore.getState();

  // 2. 원본과 메타정보(백업 시점, 버전)를 묶기
  const backup = {
    version: 1, // 버전 관리용
    exportedAt: new Date().toISOString(), // 백업 시점 기록
    songs: songStore.songs,
    tags: tagStore.tags,
  };

  // 3. 객체 -> JSON 문자열
  const json = JSON.stringify(backup, null, 2); // 3번째 인자 2 == 2칸 들여쓰기

  // 4. 문자열을 메모리상의 JSON타입의 파일(Blob)로 변환
  const blob = new Blob([json], { type: "application/json" });

  // 5. 그 Blob을 가리키는 임시 URL 생성
  const url = URL.createObjectURL(blob);

  // 6. URL을 <a> 태그에 넣고 다운로드 링크로 세팅한 뒤 코드로 클릭(다운로드)
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const a = document.createElement("a");
  a.href = url;
  a.download = `encore-backup-${today}.json`; // 다운로드 시 기본 파일명 지정
  a.click();
  a.remove(); // 클릭 후엔 제거

  //7. 뒷정리: URL.revokeObjectURL()로 메모리 해제
  URL.revokeObjectURL(url);
};

//------------------------------------------------

export type ExportedData = {
  version: number;
  exportedAt: string;
  songs: Song[];
  tags: Tag[];
};

// unknown을 '객체이긴 함~'까지 좁혀주는 타입가드
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null; // null도 object이므로 null 체크 필요

const isSong = (value: unknown): value is Song => {
  if (!isObject(value)) return false; // 객체인지 확인
  return (
    // Song 타입의 필수 속성들이 모두 존재하고 타입이 맞는지 확인
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.artist === "string" &&
    typeof value.song_key === "number" &&
    typeof value.isLater === "boolean" &&
    Array.isArray(value.tags) && // tags는 배열이어야 하고
    value.tags.every((tag) => typeof tag === "number") // 배열 안의 모든 요소가 number여야 함
  );
};

const isTag = (value: unknown): value is Tag => {
  if (!isObject(value)) return false;
  return (
    typeof value.id === "number" &&
    typeof value.label === "string" &&
    typeof value.isDefault === "boolean" &&
    // category는 정해진 세 값 중 하나
    (value.category === "mood" ||
      value.category === "situation" ||
      value.category === "custom")
  );
};

export const isBackup = (value: unknown): value is ExportedData => {
  if (!isObject(value)) return false;
  return (
    typeof value.version === "number" &&
    typeof value.exportedAt === "string" &&
    Array.isArray(value.songs) &&
    Array.isArray(value.tags) &&
    value.songs.every(isSong) && // 모든 원소가 Song 타입인지 확인
    value.tags.every(isTag)
  );
};

export const readBackupFile = async (file: File): Promise<ExportedData> => {
  const text = await file.text(); // UTF-8로 읽은 텍스트 문자열

  let data: unknown;
  try {
    data = JSON.parse(text); // 문자열 -> 객체 파싱
  } catch {
    throw new Error("파일이 JSON 형식이 아니에요.");
  }

  // 이 if문을 통과하면 data는 ExportedData 타입으로 좁혀짐!
  if (!isBackup(data)) {
    throw new Error("앵콜 백업 파일이 아니에요.");
  }

  return data;
};
