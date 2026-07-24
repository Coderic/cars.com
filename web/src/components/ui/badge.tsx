import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  available: "bg-coderic-600/10 text-coderic-600 border-coderic-600/20",
  reserved: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  sold: "bg-stone-500/10 text-stone-600 border-stone-500/20",
};

const labels: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[status] ?? styles.available)}>
      {labels[status] ?? status}
    </span>
  );
}
