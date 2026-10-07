export function TimeSlotGrid({
  slots,
  loading,
  selected,
  onSelect,
}: {
  slots: string[];
  loading: boolean;
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  if (loading) {
    return <p className="text-sm text-muted">Carregando horários…</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted">
        Sem horários livres nesse dia. Escolha outra data.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {slots.map((time) => (
        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`border px-2 py-2 text-sm font-medium ${
            selected === time
              ? "border-accent bg-accent-soft"
              : "border-line bg-surface hover:border-accent"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
