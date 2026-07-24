export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-surface)] bg-[var(--bg-surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          <span className="brand-coderic text-base">CODERIC</span>
          <span className="ml-2">Cars · Sandbox concesionario</span>
        </p>
        <p className="text-xs">© {new Date().getFullYear()} Coderic · Precios referenciales en COP</p>
      </div>
    </footer>
  );
}
