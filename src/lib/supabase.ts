import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

// Types for our database tables
export type Rama = {
  id: number;
  rama: string;
  created_at?: string;
};

export type Progresion = {
  id: number;
  progresion: string;
  descripcion?: string;
  imagen?: string;
  id_rama: number;
  created_at?: string;
  ramas?: Rama;
};

export type Beneficiario = {
  id: number;
  nombre: string;
  nacimiento: string;
  genero?: string;
  id_rama: number;
  id_progresion?: number;
  created_at?: string;
};
