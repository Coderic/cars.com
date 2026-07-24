import { Link } from "react-router-dom";

type BrandMarkProps = {
  subtitle?: string;
  homeHref?: string;
  logoSrc?: string;
};

export function BrandMark({ subtitle = "CARS", homeHref = "/", logoSrc = "/assets/img/coderic-isotipo.svg" }: BrandMarkProps) {
  const content = (
    <>
      <img src={logoSrc} alt="Coderic" className="h-10 w-10 shrink-0 md:h-11 md:w-11" />
      <div className="leading-none">
        <div className="brand-coderic">CODERIC</div>
        <span className="brand-subtitle mt-1 block">{subtitle}</span>
      </div>
    </>
  );
  if (homeHref.startsWith("http") || homeHref.startsWith("/admin")) {
    return <a href={homeHref} className="flex items-center gap-3">{content}</a>;
  }
  return <Link to={homeHref} className="flex items-center gap-3">{content}</Link>;
}
