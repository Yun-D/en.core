import HeroSection from "../components/HeroSection";

const MySongs = () => {
  const dumpData = { favsong: 0, latersong: 0 };
  return (
    <div>
      <HeroSection
        title="나의 애창곡"
        subtitle={`내 애창곡 ${dumpData.favsong} · 나중에 부를 곡 ${dumpData.latersong}`}
      />
      GoToSong
    </div>
  );
};

export default MySongs;
