import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://elktwjzvlyzcgetknedn.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsa3R3anp2bHl6Y2dldGtuZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTU2NjksImV4cCI6MjA5MTMzMTY2OX0.KfQFq_5sLqYtsZx9mt0bFaeg_6R1sXg4q4Bbsrg9b6E";

export function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
