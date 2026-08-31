// Client for the user's own external Supabase project.
// These are the project URL and anon (publishable) key — safe to ship in browser code.
import { createClient } from "@supabase/supabase-js";

const EXTERNAL_SUPABASE_URL = "https://oetsewrdnucmgfubweqe.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldHNld3JkbnVjbWdmdWJ3ZXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODUyNTIsImV4cCI6MjA5MjY2MTI1Mn0.zZbcwPNbeZSCMZ8ofts72DC1rjNBsQ1g1xI92NHCvVk";

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
