import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

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
  created_at?: string | null;
};

export type Progresion = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  imagen?: string | null;
  id_rama?: number;
  created_at?: string | null;
  ramas?: Rama | null;
};

export type Beneficiario = {
  id: number;
  nombre: string;
  nacimiento: string;
  genero: string | null;
  id_rama: number;
  id_progresion: number | null;
  created_at: string | null;
  ramas?: Rama | null;
  progresiones?: Progresion | null;
  legajos?: BeneficiarioHasLegajos[] | null;
  beneficiarios_has_legajos?: BeneficiarioHasLegajos[] | null;
  fecha_cambio_progresion: string | null;
};

export type BeneficiarioHasLegajos = {
  id: number;
  id_beneficiario: number;
  id_legajo: number;
  legajo?: Legajo;
  protagonista?: Beneficiario;
}

export type BeneficiarioFormInput = {
  id?: number,
  nombre?: string,
  nacimiento?: string,
  genero?: string,
  rama?: string | number,
  progresion?: string | number,
  fecha_cambio_progresion?: string
}