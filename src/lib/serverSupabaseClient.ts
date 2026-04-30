import { createClient } from '@supabase/supabase-js';

// Called from server-only files (+page.server.ts, +server.ts) with the
// service role key imported from $env/static/private there.
// This client bypasses Row Level Security — never use it client-side.
export function createServerSupabase(serviceRoleKey: string) {
    return createClient(
        import.meta.env.VITE_SUPABASE_URL,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}
