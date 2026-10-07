import { useEffect, useState } from "react";
import { supabase, Barber } from "../lib/supabase";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeLabel(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function useAvailableSlots(barber: Barber | null, date: string | null) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!barber || !date) {
      setSlots([]);
      return;
    }

    setLoading(true);

    supabase
      .rpc("get_booked_times", { p_barber_id: barber.id, p_date: date })
      .then(({ data }) => {
        const booked = new Set(
          (data as { appointment_time: string }[] | null)?.map((r) =>
            r.appointment_time.slice(0, 5),
          ) ?? [],
        );

        const start = toMinutes(barber.start_time.slice(0, 5));
        const end = toMinutes(barber.end_time.slice(0, 5));
        const step = barber.slot_minutes;

        const isToday = date === new Date().toISOString().slice(0, 10);
        const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

        const generated: string[] = [];
        for (let t = start; t < end; t += step) {
          const label = toTimeLabel(t);
          if (booked.has(label)) continue;
          if (isToday && t <= nowMinutes) continue;
          generated.push(label);
        }

        setSlots(generated);
        setLoading(false);
      });
  }, [barber, date]);

  return { slots, loading };
}
