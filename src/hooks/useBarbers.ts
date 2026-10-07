import { useEffect, useState } from "react";
import { supabase, Barber } from "../lib/supabase";

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("barbers")
      .select("*")
      .eq("active", true)
      .order("name")
      .then(({ data }) => {
        setBarbers((data as Barber[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { barbers, loading };
}
