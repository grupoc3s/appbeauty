import { Barber } from "../lib/supabase";

export function BarberCard({
  barber,
  selected,
  onSelect,
}: {
  barber: Barber;
  selected: boolean;
  onSelect: () => void;
}) {
  const initials = barber.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-4 border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-accent bg-accent-soft"
          : "border-line bg-surface hover:border-accent"
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-canvas">
        {initials}
      </span>
      <span>
        <span className="block font-display text-base font-semibold">
          {barber.name}
        </span>
        <span className="block text-sm text-muted">
          {barber.start_time.slice(0, 5)} às {barber.end_time.slice(0, 5)}
        </span>
      </span>
    </button>
  );
}
