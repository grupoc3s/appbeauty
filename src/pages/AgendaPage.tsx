import { useEffect, useState } from "react";
import { supabase, Appointment, Barber } from "../lib/supabase";
import { useBarbers } from "../hooks/useBarbers";

interface AppointmentWithBarber extends Appointment {
  barbers: { name: string };
}

const statusStyle: Record<Appointment["status"], string> = {
  pendente: "bg-accent-soft text-accent",
  confirmado: "bg-confirm-soft text-confirm",
  cancelado: "bg-cancel-soft text-cancel",
  concluido: "bg-line text-muted",
};

export default function AgendaPage() {
  const { barbers } = useBarbers();
  const [barberFilter, setBarberFilter] = useState<string | "todos">("todos");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [appointments, setAppointments] = useState<AppointmentWithBarber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [barberFilter, date]);

  async function load() {
    setLoading(true);
    let query = supabase
      .from("appointments")
      .select("*, barbers(name)")
      .eq("appointment_date", date)
      .order("appointment_time", { ascending: true });

    if (barberFilter !== "todos") {
      query = query.eq("barber_id", barberFilter);
    }

    const { data } = await query;
    setAppointments((data as AppointmentWithBarber[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Appointment["status"]) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    load();
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      <header className="mb-6">
        <p className="text-sm text-accent">💈 Painel interno</p>
        <h1 className="font-display text-2xl font-semibold">Agenda do dia</h1>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select
          value={barberFilter}
          onChange={(e) => setBarberFilter(e.target.value as string)}
          className="border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="todos">Todos os profissionais</option>
          {barbers.map((b: Barber) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-muted">Carregando…</p>}

      {!loading && appointments.length === 0 && (
        <p className="text-sm text-muted">Nenhum agendamento nesse dia.</p>
      )}

      <ul className="divide-y divide-line border-y border-line">
        {appointments.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 py-4">
            <div>
              <p className="font-display text-base font-semibold">
                {a.appointment_time.slice(0, 5)} · {a.client_name}
              </p>
              <p className="text-sm text-muted">
                {a.barbers?.name} · {a.client_phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium ${statusStyle[a.status]}`}
              >
                {a.status}
              </span>
              {a.status === "pendente" && (
                <button
                  onClick={() => updateStatus(a.id, "confirmado")}
                  className="border border-confirm px-2 py-1 text-xs font-medium text-confirm hover:bg-confirm-soft"
                >
                  Confirmar
                </button>
              )}
              {a.status !== "cancelado" && a.status !== "concluido" && (
                <button
                  onClick={() => updateStatus(a.id, "cancelado")}
                  className="border border-cancel px-2 py-1 text-xs font-medium text-cancel hover:bg-cancel-soft"
                >
                  Cancelar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
