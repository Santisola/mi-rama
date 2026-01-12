// Types for Diario de Marcha (Journey Diary) - Caminantes Branch
// Adjusted to match real database schema from Supabase images

// Area types for competencies
export type Area =
  | 'salud_y_bienestar'
  | 'paz_y_desarrollo'
  | 'ambiente'
  | 'habilidades_para_la_vida';

// Estado for competencies
export type EstadoCompetencia = 'elegida' | 'en_desarrollo' | 'lograda';

// Etapa (Stage) entity
export type Etapa = {
  id: number;
  nombre: string;
  orden: number;
  rama_id: number;
};

// Competencia (Competency) entity
export type Competencia = {
  id: number;
  nombre: string;
  descripcion: string;
  area: Area;
  rama_id: number;
};

// Diario de Marcha (Journey Diary) entity
export type DiarioMarcha = {
  id: number;
  beneficiario_id: number;
  etapa_id: number;
  fecha_inicio: string; // timestamp
  fecha_cierre: string | null; // timestamp or null if active
  reflexion_inicial: string;
  reflexion_final: string | null;
};

// Diario Competencias (junction table with achievement status)
export type DiarioCompetencia = {
  id: number;
  diario_id: number;
  competencia_id: number;
  estado: EstadoCompetencia;
  fecha_logro: string | null; // timestamp or null
};

// Accion (Action) entity
export type Accion = {
  id: number;
  diario_competencia_id: number;
  descripcion: string;
  reflexion: string;
  fecha: string; // timestamp
};

// Observacion del Educador (Educator Observation) entity
export type ObservacionEducador = {
  id: number;
  diario_competencia_id: number;
  educador_id: string; // Adjusted to UUID as per image 0 (looks like uuid type)
  comentario: string;
  fecha: string; // timestamp
};

// Extended types for UI display

// DiarioMarcha with related etapa
export type DiarioMarchaConRelaciones = DiarioMarcha & {
  etapa: Etapa;
};

// DiarioCompetencia with related competencia
export type DiarioCompetenciaConRelaciones = DiarioCompetencia & {
  competencia: Competencia;
};

// Progress tracking by area
export type ProgresoArea = {
  area: Area;
  logradas: number;
  total: number;
};

// Overall progress summary
export type ProgresoResumen = {
  total_logradas: number;
  total_competencias: number;
  por_area: ProgresoArea[];
  lista_para_cerrar: boolean; // true if >= 12 competencias logradas (estado='lograda')
};

// Form input types
export type AccionFormInput = {
  descripcion: string;
  reflexion: string;
};

export type ObservacionFormInput = {
  comentario: string;
};

export type CierreEtapaFormInput = {
  reflexion_final: string;
};

// Area display configuration
export type AreaConfig = {
  nombre: string;
  color: string;
  icono: string;
};

export const AREA_CONFIG: Record<Area, AreaConfig> = {
  salud_y_bienestar: {
    nombre: 'Salud y Bienestar',
    color: '#10b981', // green
    icono: '💚',
  },
  paz_y_desarrollo: {
    nombre: 'Paz y Desarrollo',
    color: '#3b82f6', // blue
    icono: '🕊️',
  },
  ambiente: {
    nombre: 'Ambiente',
    color: '#22c55e', // emerald
    icono: '🌱',
  },
  habilidades_para_la_vida: {
    nombre: 'Habilidades para la Vida',
    color: '#f59e0b', // amber
    icono: '⚡',
  },
};

// Stage icons
export const ETAPA_ICONOS: Record<string, string> = {
  fuego: '🔥',
  tierra: '🌍',
  agua: '💧',
  aire: '💨',
};
