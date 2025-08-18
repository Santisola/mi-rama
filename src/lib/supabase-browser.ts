// src/lib/supabase-browser.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export function createBrowserSupabaseClientInstance() {
  return createClientComponentClient<Database>();
}
