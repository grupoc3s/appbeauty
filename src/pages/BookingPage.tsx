import { useState } from "react";
import { useBarbers } from "../hooks/useBarbers";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { BarberCard } from "../components/BarberCard";
import { DateStrip } from "../components/DateStrip";
import { TimeSlotGrid } from "../components/TimeSlotGrid";
import { supabase, Barber } from "../lib/supabase";
import { buildWhatsAppConfirmationLink } from "../lib/whatsapp";

type Step = "barbeiro" | "horario" | "dados" | "concluido";

export default function BookingPage() {
  const { barbers, loading } = useBarbers();

  const [step, setStep] = useState<Step>("barbeiro");
  const [barber, setBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  const { slots, loading: loadingSlots } = useAvailableSlots(barber, date);

  async function handleConfirm() {
    if (!barber || !date || !time || !clientName || !clientPhone) return;
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("appointments").insert({
      barber_id: barber.id,
      client_name: clientName,
      client_phone: clientPhone,
      appointment_date: date,
      appointment_time: time,
    });

    setSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Esse horário acabou de ser reservado por outra pessoa. Escolha outro."
          : "Não deu para salvar o agendamento. Tente de novo.",
      );
      return;
    }

    setWhatsappLink(
      buildWhatsAppConfirmationLink({ barber, clientName, date, time }),
    );
    setStep("concluido");
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-5 py-8">
      <header className="mb-6">
        <p className="text-sm text-accent">💈 Agenda online</p>
        <h1 className="font-display text-2xl font-semibold">
          Marque seu horário
        </h1>
      </header>

      <StepIndicator step={step} />

      {step === "barbeiro" && (
        <section className="mt-6 space-y-3">
          <h2 className="font-display text-lg font-semibold">
            Escolha o profissional
          </h2>
          {loading && <p className="text-sm text-muted">Carregando…</p>}
          {barbers.map((b) => (
            <BarberCard
              key={b.id}
              barber={b}
              selected={barber?.id === b.id}
              onSelect={() => {
                setBarber(b);
                setStep("horario");
              }}
            />
          ))}
        </section>
      )}

      {step === "horario" && barber && (
        <section className="mt-6 space-y-5">
          <button
            onClick={() => setStep("barbeiro")}
            className="text-sm text-muted hover:text-ink"
          >
            ← Trocar profissional
          </button>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold">
              Escolha o dia
            </h2>
            <DateStrip selected={date} onSelect={(d) => { setDate(d); setTime(null); }} />
          </div>

          {date && (
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold">
                Escolha o horário
              </h2>
              <TimeSlotGrid
                slots={slots}
                loading={loadingSlots}
                selected={time}
                onSelect={setTime}
              />
            </div>
          )}

          {time && (
            <button
              onClick={() => setStep("dados")}
              className="w-full bg-ink py-3 font-medium text-canvas"
            >
              Continuar
            </button>
          )}
        </section>
      )}

      {step === "dados" && barber && date && time && (
        <section className="mt-6 space-y-4">
          <button
            onClick={() => setStep("horario")}
            className="text-sm text-muted hover:text-ink"
          >
            ← Trocar horário
          </button>

          <div className="border border-line bg-surface px-4 py-3 text-sm">
            <p>
              <strong>{barber.name}</strong> ·{" "}
              {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              às {time}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Seu nome</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Como podemos te chamar"
              className="w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Seu WhatsApp
            </label>
            <input
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="(11) 99999-0000"
              className="w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-cancel">{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={saving || !clientName || !clientPhone}
            className="w-full bg-accent py-3 font-medium text-white disabled:opacity-40"
          >
            {saving ? "Agendando…" : "Confirmar agendamento"}
          </button>
        </section>
      )}

      {step === "concluido" && barber && date && time && whatsappLink && (
        <section className="mt-6 space-y-4 text-center">
          <div className="border border-confirm bg-confirm-soft px-4 py-6">
            <p className="font-display text-lg font-semibold text-confirm">
              Horário reservado!
            </p>
            <p className="mt-1 text-sm text-ink">
              {barber.name} ·{" "}
              {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              às {time}
            </p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-ink py-3 font-medium text-canvas"
          >
            Confirmar pelo WhatsApp
          </a>
          <p className="text-xs text-muted">
            Abre uma conversa com {barber.name} já com a mensagem de
            confirmação pronta — é só enviar.
          </p>
        </section>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["barbeiro", "horario", "dados", "concluido"];
  const labels: Record<Step, string> = {
    barbeiro: "Profissional",
    horario: "Data e hora",
    dados: "Seus dados",
    concluido: "Pronto",
  };
  const current = steps.indexOf(step);

  return (
    <ol className="flex gap-2 text-xs text-muted">
      {steps.map((s, i) => (
        <li
          key={s}
          className={`flex-1 border-t-2 pt-2 ${
            i <= current ? "border-accent text-ink" : "border-line"
          }`}
        >
          {labels[s]}
        </li>
      ))}
    </ol>
  );
}
