type EmptySongsProps = {
  onSearchClick: () => void; // 검색 탭으로 이동하는 함수 받아오기
  onAddClick: () => void; // 직접 추가하기 함수 받아오기
};
const EmptySongs = ({ onSearchClick, onAddClick }: EmptySongsProps) => {
  return (
    <div className="flex flex-col items-center text-center justify-center gap-3">
      <div className="flex items-center justify-center rounded-full h-10 w-10 border border-(--color-accent) bg-[#f472b550]">
        <i className="text-xl ti ti-music" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">아직 저장된 곡이 없어요</p>
        <p className="text-sm text-(--color-text-placeholder)">
          당신의 18번을 저장해볼까요?
        </p>
      </div>

      <div className="flex justify-center flex-col items-center">
        <button
          onClick={onSearchClick}
          className="cursor-pointer mt-4 border border-(--color-accent) 
          bg-[#f472b590] hover:bg-[#e37fb3] transition-colors duration-200
          px-5 py-2 text-sm font-semibold rounded-full items-center flex"
        >
          <i className="ti ti-search mr-2" />
          노래 검색하러 가기
        </button>

        <button
          onClick={onAddClick}
          className="cursor-pointer mt-2.5 border border-(--color-accent) 
          bg-[#f472b590] hover:bg-[#e37fb3] transition-colors duration-200
          px-5 py-2 text-sm font-semibold rounded-full items-center flex"
        >
          <i className="ti ti-plus mr-2" />
          직접 추가하기
        </button>
      </div>
    </div>
  );
};

export default EmptySongs;
