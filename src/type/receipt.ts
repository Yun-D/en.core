export interface ReceiptSong {
  id: number;
  title: string;
  artist: string;
  number_tj?: number;
  number_ky?: number;
  song_key: number;
  score: number | null; // 미입력이면 null. 0과는 다름~
}

export interface ReceiptData {
  createdAt: number;
  enteredAt: string; // "hh:mm"
  includeScore: boolean;
  mvpId: number | null;
  songs: ReceiptSong[];
}
