import { Beneficiario, BeneficiarioFormInput, supabase, supabaseAuth } from './supabase';

export async function getBeneficiarios() {
  const { data, error } = await supabase.from('beneficiarios').select(
    `
		*,
		ramas:id_rama(id, nombre),
		progresiones:id_progresion(id, nombre)
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

  return {data, error};
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

  const currentIds = (currentLegajos || []).map(l => l.id_legajo);
  
  // Calcular qué eliminar y qué insertar
  const toDelete = currentIds.filter(id => !assignedLegajoIds.includes(id));
  const toInsert = assignedLegajoIds.filter(id => !currentIds.includes(id));
  
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