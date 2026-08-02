import { useSongStore } from "../store/useSongStore";
import { useTagStore } from "../store/useTagStore";

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
