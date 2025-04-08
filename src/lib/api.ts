import { Beneficiario, supabase } from './supabase';

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

export async function updateBeneficiario(beneficiario: Beneficiario) {
  const { data, error } = await supabase
    .from('beneficiarios')
    .update(beneficiario)
    .eq('id', beneficiario.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
