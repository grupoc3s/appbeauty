import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Barber {
  id: string;
  name: string;
  photo_url: string | null;
  whatsapp_number: string;
  start_time: string; // "09:00:00"
  end_time: string;
  slot_minutes: number;
}

export interface Appointment {
  id: string;
  barber_id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string; // "2026-09-03"
  appointment_time: string; // "14:30:00"
  status: "pendente" | "confirmado" | "cancelado" | "concluido";
}
