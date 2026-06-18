export type BrandKey = "tj" | "kumyoung";

// 노래방 API 응답에서 곡 정보를 나타내는 타입 정의
export type KaraokeAPISong = {
  no: string;
  title: string;
  singer: string;
};
