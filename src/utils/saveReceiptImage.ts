import { toPng } from "html-to-image";

/*
1. 영수증 DOM을 png data URL로 변환
2. data URL를 blob로 변환
3. blob를 file로 변환
4. 공유가 되는 환경이면 -> navigator.share(file)
    - 취소하면 조용히 종료
5. 공유가 안되는 환경이면 -> a태그로 다운로드
    - 모바일에선 4번, 데스크톱에선 5번으로 실행될 것.
*/

export const saveReceiptImage = async (node: HTMLElement, fileName: string) => {
  const options = {
    pixelRatio: 3, // 3배 해상도로 뽑기
    backgroundColor: "#FAF9F6",
    cacheBust: true, // 캐시 때문에 폰트 깨짐 방지
  };

  // iOS Safari는 첫 호출에서 폰트가 덜 반영되는 이슈가 있다고 함 -> 한 번 버리는 호출로 예열
  await toPng(node, options);
  const dataUrl = await toPng(node, options); // toPng 반환 값 == 이미지 데이터를 텍스트(문자열)로 인코딩한 것

  const blob = await (await fetch(dataUrl)).blob(); // blob 형태로 다시 변환(navigator.share가 file 형태를 받아야 하기에)
  const file = new File([blob], fileName, { type: "image/png" }); // file형태로 변환. 이게 파일명이 됨

  // 모바일에선 <a download>가 막히는 경우가 많아 네이티브 공유 시트(사진앱 저장, 카톡으로 보내기...) 먼저 시도함
  if (navigator.canShare?.({ files: [file] })) {
    // canShare API가 있을 때
    try {
      await navigator.share({ files: [file] });
      return; // 성공 시 종료
    } catch (error) {
      // 사용자가 공유 창을 닫은 경우(공유 중 취소) -> 그냥 종료
      if (error instanceof Error && error.name === "AbortError") return;
    }
  }

  // 공유 기능이 없는 환경(PC 등)을 위한 대비책
  const link = document.createElement("a"); // 화면에 없는 a태그 새로 만들어
  link.href = dataUrl; // 이미지 url 넣고
  link.download = fileName; // 다운로드 속성으로 클릭하면 다운로드 되도록 지정한 뒤
  link.click(); // 코드가 대신 클릭하도록!
};
