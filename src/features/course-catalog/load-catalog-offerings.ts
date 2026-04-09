import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import type { Database } from "@/types/database";

type CatalogOfferingRow = Database["public"]["Views"]["catalog_offerings_v1"]["Row"];

export async function loadCatalogOfferings(): Promise<CatalogOfferingRow[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("catalog_offerings_v1")
    .select("*")
    .order("overall_semester", { ascending: true })
    .order("program_code", { ascending: true })
    .order("course_code", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
