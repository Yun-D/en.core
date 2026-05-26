type HeroSectionProps = {
  title?: string;
  subtitle?: string;
};

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  return (
    <div className="pt-6 pb-10">
      <img src="src/assets/logo.svg" alt="en.core logo" className="w-20" />

      {title && <h1 className="text-2xl font-bold mt-5">{title}</h1>}
      {subtitle && (
        <p className="text-sm text-(--color-text-placeholder) mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default HeroSection;
