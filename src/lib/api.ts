import { supabase, Beneficiario } from './supabase';

// Beneficiarios API
export async function getBeneficiarios() {
  const { data, error } = await supabase.from('beneficiarios').select(
    `
      *,
      ramas:id_rama(id, rama),
      progresiones:id_progresion(id, progresion)
    `
  );

  if (error) throw error;
  return data;
}

export async function getBeneficiario(id: number) {
  const { data, error } = await supabase
    .from('beneficiarios')
    .select(
      `
      *,
      ramas:id_rama(id, rama),
      progresiones:id_progresion(id, progresion)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBeneficiario(
  beneficiario: unknown /* Omit<Beneficiario, 'id' | 'created_at'> */
) {
  const { data, error } = await supabase
    .from('beneficiarios')
    .insert(beneficiario)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBeneficiario(
  id: number,
  beneficiario: Partial<Omit<Beneficiario, 'id' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('beneficiarios')
    .update(beneficiario)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBeneficiario(id: number) {
  const { error } = await supabase.from('beneficiarios').delete().eq('id', id);

  if (error) throw error;
  return true;
}

// Ramas API
export async function getRamas() {
  const { data, error } = await supabase.from('ramas').select('*');

  if (error) throw error;
  return data;
}

export async function getRama(id: number) {
  const { data, error } = await supabase
    .from('ramas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Progresiones API
export async function getProgresiones() {
  const { data, error } = await supabase.from('progresiones').select(
    `
      *,
      ramas:id_rama(id, rama)
    `
  );

  if (error) throw error;
  return data;
}

export async function getProgresionesForRama(ramaId: number) {
  const { data, error } = await supabase
    .from('progresiones')
    .select('*')
    .eq('id_rama', ramaId);

  if (error) throw error;
  return data;
}

export async function getProgresion(id: number) {
  const { data, error } = await supabase
    .from('progresiones')
    .select(
      `
      *,
      ramas:id_rama(id, rama)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
