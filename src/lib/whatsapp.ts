import { Barber } from "./supabase";

export function buildWhatsAppConfirmationLink({
  barber,
  clientName,
  date,
  time,
}: {
  barber: Barber;
  clientName: string;
  date: string; // "2026-09-03"
  time: string; // "14:30"
}) {
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "pt-BR",
    { weekday: "long", day: "2-digit", month: "2-digit" },
  );

  const message =
    `Olá, ${barber.name}! Aqui é ${clientName}. ` +
    `Gostaria de confirmar meu horário para ${formattedDate} às ${time}. 💈`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${barber.whatsapp_number}?text=${encoded}`;
}
