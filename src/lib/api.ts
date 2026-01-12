import { Beneficiario, BeneficiarioFormInput, supabase, supabaseAuth } from './supabase';

export async function getBeneficiarios() {
  const { data, error } = await supabase.from('beneficiarios').select(
    `
		*,
		ramas:id_rama(id, nombre),
		progresiones:id_progresion(id, nombre),
    beneficiarios_has_legajos (
      id_legajo,
      legajos:id_legajo(legajo)
    )
	  `
  );

  if (error) throw error;
  return data;
}

export async function getBeneficiario(id: number | string) {
  const { data, error } = await supabase
    .from('beneficiarios')
    .select(
      `
      *,
      ramas:id_rama(id, nombre),
      progresiones:id_progresion(id, nombre)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;

  const { data: legajosData } = await getLegajosByPibe(id);

  data.legajos = legajosData || null;

  return data;
}

export async function getProgresiones() {
  const { data, error } = await supabase.from('progresiones').select(
    `
		*
	  `
  );

  if (error) throw error;
  return data;
}

export async function getLegajosByPibe(id: number | string) {
  const { data, error } = await supabase
    .from('beneficiarios_has_legajos')
    .select(
      `
    *,
    legajo:id_legajo(*),
    protagonista:id_beneficiario(*)
    `
    )
    .eq('id_beneficiario', id);

  if (error) console.error('Error fetching legajos by pibe:', error);

  return { data, error };
}

export async function getAllLegajos() {
  const { data, error } = await supabase
    .from('legajos')
    .select(
      `
    *
    `
    )

  if (error) throw error;
  return data;
}

export async function updateBeneficiario(beneficiario: BeneficiarioFormInput) {
  const payload = {
    nombre: beneficiario.nombre,
    nacimiento: beneficiario.nacimiento,
    genero: beneficiario.genero,
    id_rama: beneficiario.rama,
    id_progresion: beneficiario.progresion,
    fecha_cambio_progresion: beneficiario.fecha_cambio_progresion,
    id: beneficiario.id,
  }

  const { data, error } = await supabaseAuth
    .from('beneficiarios')
    .update(payload)
    .eq('id', beneficiario.id)
    .select(`
      *,
      ramas:id_rama(id, nombre),
      progresiones:id_progresion(id, nombre)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function createBeneficiario({
  nombre,
  nacimiento,
  genero,
  ...beneficiario
}: {
  nombre: string;
  nacimiento: string;
  genero: string;
  rama: string | number;
  progresion: string | number;
}) {
  const { data, error } = await supabase
    .from('beneficiarios')
    .insert({
      nombre,
      nacimiento,
      genero,
      id_rama: beneficiario.rama,
      id_progresion: beneficiario.progresion,
    })
    .select(
      `
      *,
      ramas:id_rama(id, nombre),
      progresiones:id_progresion(id, nombre)
    `
    )
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBeneficiario(id: number | string) {
  const { error } = await supabaseAuth
    .from('beneficiarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function updateBeneficiarioLegajos(id_beneficiario: number | string, assignedLegajoIds: number[]) {
  // Obtener legajos actuales
  const { data: currentLegajos, error: fetchError } = await supabaseAuth
    .from('beneficiarios_has_legajos')
    .select('id_legajo')
    .eq('id_beneficiario', id_beneficiario);

  if (fetchError) throw fetchError;

  const currentIds = (currentLegajos || []).map((l: { id_legajo: number }) => l.id_legajo);

  // Calcular qué eliminar y qué insertar
  const toDelete = currentIds.filter((id: number) => !assignedLegajoIds.includes(id));
  const toInsert = assignedLegajoIds.filter((id: number) => !currentIds.includes(id));

  // Ejecutar eliminaciones
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabaseAuth
      .from('beneficiarios_has_legajos')
      .delete()
      .eq('id_beneficiario', id_beneficiario)
      .in('id_legajo', toDelete);

    if (deleteError) throw deleteError;
  }

  // Ejecutar inserciones
  if (toInsert.length > 0) {
    const { error: insertError } = await supabaseAuth
      .from('beneficiarios_has_legajos')
      .insert(toInsert.map(id_legajo => ({ id_beneficiario, id_legajo })));

    if (insertError) throw insertError;
  }

  return { success: true, deleted: toDelete.length, inserted: toInsert.length };
}

// ============================================
// DIARIO DE MARCHA API FUNCTIONS
// ============================================

import type {
  DiarioMarchaConRelaciones,
  DiarioCompetenciaConRelaciones,
  Accion,
  ObservacionEducador,
  ProgresoResumen,
  ProgresoArea,
  Area,
  AccionFormInput,
  ObservacionFormInput,
  Etapa,
  Competencia,
} from '@/types/diario-marcha';

/**
 * Get active diary for a beneficiario (protagonist)
 * Active diary has fecha_cierre = null
 */
export async function getDiarioActivoByBeneficiario(
  beneficiarioId: number | string
): Promise<DiarioMarchaConRelaciones | null> {
  const { data, error } = await supabase
    .from('diarios_marcha')
    .select(`
      id,
      beneficiario_id,
      etapa_id,
      fecha_inicio,
      fecha_cierre,
      reflexion_inicial,
      reflexion_final,
      etapa:etapas(id, nombre, orden, rama_id)
    `)
    .eq('beneficiario_id', beneficiarioId)
    .is('fecha_cierre', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No active diary found
      return null;
    }
    throw error;
  }

  const result = data as any;
  if (Array.isArray(result.etapa)) {
    result.etapa = result.etapa[0];
  }

  return result as DiarioMarchaConRelaciones;
}

/**
 * Get all competencies for a diary with their achievement status
 */
export async function getCompetenciasByDiario(
  diarioId: number | string
): Promise<DiarioCompetenciaConRelaciones[]> {
  const { data, error } = await supabase
    .from('diario_competencias')
    .select(`
      id,
      diario_id,
      competencia_id,
      estado,
      fecha_logro,
      competencia:competencias(id, nombre, descripcion, area, rama_id)
    `)
    .eq('diario_id', diarioId);

  if (error) throw error;

  const result = (data || []).map((dc: any) => {
    if (Array.isArray(dc.competencia)) {
      dc.competencia = dc.competencia[0];
    }
    return dc;
  });

  return result as DiarioCompetenciaConRelaciones[];
}

/**
 * Get all actions for a specific diario_competencia
 */
export async function getAccionesByDiarioCompetencia(
  diarioCompetenciaId: number | string
): Promise<Accion[]> {
  const { data, error } = await supabase
    .from('acciones')
    .select('*')
    .eq('diario_competencia_id', diarioCompetenciaId)
    .order('fecha', { ascending: false });

  if (error) throw error;

  return data || [];
}

/**
 * Get all educator observations for a specific diario_competencia
 */
export async function getObservacionesByDiarioCompetencia(
  diarioCompetenciaId: number | string
): Promise<ObservacionEducador[]> {
  const { data, error } = await supabase
    .from('observaciones_educador')
    .select('*')
    .eq('diario_competencia_id', diarioCompetenciaId)
    .order('fecha', { ascending: false });

  if (error) throw error;

  return data || [];
}

/**
 * Calculate progress for a diary (total and by area)
 */
export async function getProgresoByDiario(
  diarioId: number | string
): Promise<ProgresoResumen> {
  const competencias = await getCompetenciasByDiario(diarioId);

  const total_competencias = competencias.length;
  const total_logradas = competencias.filter((c) => c.estado === 'lograda').length;

  // Group by area
  const areaMap = new Map<Area, { logradas: number; total: number }>();

  competencias.forEach((dc) => {
    const area = dc.competencia.area;
    if (!areaMap.has(area)) {
      areaMap.set(area, { logradas: 0, total: 0 });
    }
    const areaData = areaMap.get(area)!;
    areaData.total += 1;
    if (dc.estado === 'lograda') {
      areaData.logradas += 1;
    }
  });

  const por_area: ProgresoArea[] = Array.from(areaMap.entries()).map(
    ([area, data]) => ({
      area,
      logradas: data.logradas,
      total: data.total,
    })
  );

  const lista_para_cerrar = total_logradas >= 12;

  return {
    total_logradas,
    total_competencias,
    por_area,
    lista_para_cerrar,
  };
}

/**
 * Create a new action for a competency
 */
export async function createAccion(
  diarioCompetenciaId: number,
  formData: AccionFormInput
): Promise<Accion> {
  const { data, error } = await supabaseAuth
    .from('acciones')
    .insert({
      diario_competencia_id: diarioCompetenciaId,
      descripcion: formData.descripcion,
      reflexion: formData.reflexion,
      fecha: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create a new educator observation for a competency
 */
export async function createObservacion(
  diarioCompetenciaId: number,
  educadorId: string,
  formData: ObservacionFormInput
): Promise<ObservacionEducador> {
  const { data, error } = await supabaseAuth
    .from('observaciones_educador')
    .insert({
      diario_competencia_id: diarioCompetenciaId,
      educador_id: educadorId,
      comentario: formData.comentario,
      fecha: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Mark a competency as achieved (lograda)
 */
export async function marcarCompetenciaLograda(
  diarioCompetenciaId: number
): Promise<void> {
  const { error } = await supabaseAuth
    .from('diario_competencias')
    .update({
      estado: 'lograda',
      fecha_logro: new Date().toISOString(),
    })
    .eq('id', diarioCompetenciaId);

  if (error) throw error;
}

/**
 * Close a stage (etapa) by setting fecha_cierre and reflexion_final
 */
export async function cerrarEtapa(
  diarioId: number,
  reflexionFinal: string
): Promise<void> {
  const { error } = await supabaseAuth
    .from('diarios_marcha')
    .update({
      fecha_cierre: new Date().toISOString(),
      reflexion_final: reflexionFinal,
    })
    .eq('id', diarioId);

  if (error) throw error;
}
/**
 * Get all stages for a specific rama
 */
export async function getEtapas(ramaId: number | string): Promise<Etapa[]> {
  const { data, error } = await supabase
    .from('etapas')
    .select('*')
    .eq('rama_id', ramaId)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get all available competencies for a rama that are NOT already in the diary
 */
export async function getCompetenciasDisponibles(
  ramaId: number | string,
  diarioId: number | string
): Promise<Competencia[]> {
  // 1. Get IDs of competencies already in the diary
  const { data: existing, error: existingError } = await supabase
    .from('diario_competencias')
    .select('competencia_id')
    .eq('diario_id', diarioId);

  if (existingError) throw existingError;
  const existingIds = (existing || []).map(e => e.competencia_id);

  // 2. Get all competencies for the rama
  let query = supabase
    .from('competencias')
    .select('*')
    .eq('rama_id', ramaId);

  if (existingIds.length > 0) {
    query = query.not('id', 'in', `(${existingIds.join(',')})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Assign selected competencies to a diary
 */
export async function asignarCompetencias(
  diarioId: number,
  competenciaIds: number[]
): Promise<void> {
  if (competenciaIds.length === 0) return;

  const inserts = competenciaIds.map(id => ({
    diario_id: diarioId,
    competencia_id: id,
    estado: 'elegida' as const
  }));

  const { error } = await supabaseAuth
    .from('diario_competencias')
    .insert(inserts);

  if (error) throw error;
}

/**
 * Update the current stage of a diary
 */
export async function updateDiarioEtapa(
  diarioId: number,
  etapaId: number
): Promise<void> {
  const { error } = await supabaseAuth
    .from('diarios_marcha')
    .update({ etapa_id: etapaId })
    .eq('id', diarioId);

  if (error) throw error;
}

/**
 * Create a new Diario de Marcha
 */
export async function createDiarioMarcha(
  beneficiarioId: number,
  etapaId: number,
  reflexionInicial: string
): Promise<DiarioMarchaConRelaciones> {
  const { data, error } = await supabaseAuth
    .from('diarios_marcha')
    .insert({
      beneficiario_id: beneficiarioId,
      etapa_id: etapaId,
      reflexion_inicial: reflexionInicial,
      fecha_inicio: new Date().toISOString(),
    })
    .select(`
      id,
      beneficiario_id,
      etapa_id,
      fecha_inicio,
      fecha_cierre,
      reflexion_inicial,
      reflexion_final,
      etapa:etapas(id, nombre, orden, rama_id)
    `)
    .single();

  if (error) throw error;

  const result = data as any;
  if (Array.isArray(result.etapa)) {
    result.etapa = result.etapa[0];
  }

  return result as DiarioMarchaConRelaciones;
}

