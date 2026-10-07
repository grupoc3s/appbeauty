function nextDays(count: number) {
  const days: { iso: string; weekday: string; day: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      day: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    });
  }
  return days;
}

export function DateStrip({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  const days = nextDays(14);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((d) => {
        const isActive = d.iso === selected;
        return (
          <button
            key={d.iso}
            onClick={() => onSelect(d.iso)}
            className={`flex w-16 shrink-0 flex-col items-center border px-2 py-3 ${
              isActive
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-accent"
            }`}
          >
            <span className="text-xs uppercase text-muted">{d.weekday}</span>
            <span className="mt-1 font-display text-sm font-semibold">
              {d.day}
            </span>
          </button>
        );
      })}
    </div>
  );
}
