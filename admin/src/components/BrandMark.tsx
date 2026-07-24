import { Link } from "react-router-dom";

type BrandMarkProps = {
  subtitle?: string;
  homeHref?: string;
  logoSrc?: string;
};

export function BrandMark({
  subtitle = "ADMIN",
  homeHref = "/admin/",
  logoSrc = "/admin/assets/img/coderic-isotipo.svg",
}: BrandMarkProps) {
  return (
    <a href={homeHref} className="flex items-center gap-3">
      <img src={logoSrc} alt="Coderic" className="h-9 w-9 shrink-0" />
      <div className="leading-none">
        <div className="brand-coderic">CODERIC</div>
        <span className="brand-subtitle mt-1 block">{subtitle}</span>
      </div>
    </a>
  );
}
