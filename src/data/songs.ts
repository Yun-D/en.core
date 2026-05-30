export type Song = {
  id: number;
  title: string;
  artist: string;
  number_tj?: number; // TJ 노래 번호
  number_ky?: number; // KY 노래 번호
  song_key: number; // 0 = 원곡 키
  tags: number[]; // 태그 ID 배열
  isLater: boolean; // 나중에 부르기 여부
};
