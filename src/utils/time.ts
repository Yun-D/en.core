// ms 타임스탬프 -> hh:mm
export const formatTime = (ms: number) => {
  const date = new Date(ms);
  const hh = String(date.getHours()).padStart(2, "0"); // "string".padStart(원하는 길이, "채울 문자열")
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const formatDateTimeLocal = (ms: number) => {
  const date = new Date(ms);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${dd}T${hh}:${mm}`;
};

// ms 타임스탬프 -> yyyy-mm-dd (day)
export const formatDate = (ms: number) => {
  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dayOfWeek = WEEKDAYS[date.getDay()];
  return `${year}-${month}-${day} (${dayOfWeek})`;
};
