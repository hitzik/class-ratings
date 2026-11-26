// Supabase connection. Both values are public by design (access is enforced by
// Row Level Security policies in supabase/setup.sql). Never put the service_role key here.
export const SUPABASE_URL = 'https://scufnysphbfniywnjdnt.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_cW-iQ9rlHnU2N7oT9UY1cQ_4DM5eV0a'

/** When no key is set, the app runs in local demo mode (browser storage + sample data). */
export const USE_SUPABASE = SUPABASE_ANON_KEY.length > 0
