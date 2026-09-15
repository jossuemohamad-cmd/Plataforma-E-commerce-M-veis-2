import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim();

function isPlaceholder(value: string | undefined) {
  if (!value) return true;
  const normalized = value.toLowerCase();
  return [
    'seu-projeto',
    'sua-chave',
    'sua_chave',
    'your-project',
    'your_project',
    'your-key',
    'your_key',
    'change-me',
    'changeme'
  ].some((placeholder) => normalized.includes(placeholder));
}

function hasValidUrl(value: string | undefined) {
  if (!value || isPlaceholder(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname));
  } catch {
    return false;
  }
}

function hasValidPublicKey(value: string | undefined) {
  if (!value || isPlaceholder(value)) return false;
  return (value.startsWith('sb_publishable_') && value.length > 30) || (value.startsWith('eyJ') && value.length > 80);
}

export const isSupabaseConfigured = hasValidUrl(supabaseUrl) && hasValidPublicKey(supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ficheiro .env.local.'
    );
  }
  return supabase;
}
