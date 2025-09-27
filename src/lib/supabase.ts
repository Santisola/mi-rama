import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export const supabaseAuth = createClientComponentClient();

// Types for our database tables
export type Rama = {
  id: number;
  nombre: string;
  created_at?: string;
};

export type Progresion = {
  id: number;
  nombre: string;
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
  ramas?: Rama;
  progresiones?: Progresion;
  fecha_cambio_progresion: string | null;
};

export type BeneficiarioFormInput = {
    id?: number,
    nombre: string,
    nacimiento: string,
    genero: string,
    rama: string | number,
    progresion: string | number,
    fecha_cambio_progresion?: string
}