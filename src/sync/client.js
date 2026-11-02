// Supabase connection for the "Together" (shared progress) feature.
// Fill these in from Supabase → Project Settings → API, or set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// as environment variables in Netlify. The anon key is public by design; the database rules
// in supabase/schema.sql decide who can read what.
const URL_FALLBACK = 'https://ebsbicxbxrsdlilhjngl.supabase.co';
const KEY_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVic2JpY3hieHJzZGxpbGhqbmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MTI3MjgsImV4cCI6MjEwOTE4ODcyOH0.0h5hztFKTgem0p7i9809xQIqhTBNH8MTHsDhH7fqHjA';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || URL_FALLBACK;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || KEY_FALLBACK;
export const syncConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let clientPromise = null;

// Loaded on demand so the app stays light for anyone not using sharing.
export function getClient() {
  if (!syncConfigured) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: 'sayedhelth-auth' },
      }));
  }
  return clientPromise;
}
