import type { ReactNode } from "react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

const HeroSection = ({ title, subtitle, action }: HeroSectionProps) => {
  return (
    <div className="pt-6 mb-10 flex flex-col">
      <div className="flex justify-between items-center">
        <img src="/logo.svg" alt="en.core logo" className="w-20" />
        {action}
      </div>

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
