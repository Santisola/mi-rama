import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { supabaseAuth, supabase } from './supabase';

interface SignUpInput {
  email: string;
  password: string;
  nombre: string;
  rama: string | number;
}

export async function signInWithEmail({ email, password }: { email: string, password: string }) {
  try {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error iniciando sesión!', error);
    return { error: 'Error iniciando sesión. Por favor, intente nuevamente.' };
  }
}

export async function signUpNewUser({ nombre, email, rama, password }: SignUpInput) {
  try {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: '/protagonistas',
      },
    })

    if (error) throw error;

    const userId = data.user?.id;

    if (userId) {
      // Inserta directamente en educadores
      const { data: insertData, error: insertError } = await supabaseAuth
        .from("educadores")
        .insert({
          id: userId,
          name: nombre,
          id_rama: rama,
        })
        .select(`
              *,
              ramas:id_rama(id, nombre)
            `)
        .single();

      if (insertError) {
        throw insertError;
      }

      return insertData;
    }

    throw new Error('No se pudo obtener el ID del usuario después del registro.');
  } catch (error) {
    console.error('Error registrando usuario!', error);
    return { error: 'Error registrando usuario. Por favor, intente nuevamente.', log: error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabaseAuth.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error cerrando sesión!', error);
    return { error: 'Error cerrando sesión. Por favor, intente nuevamente.' };
  }
}

export async function getCurrentUser(supabase: SupabaseClient<any>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getCurrentUserProfile(
  supabase: SupabaseClient<any>
) {
  try {
    const user = await getCurrentUser(supabase);
    if (!user) return null;

    const { data, error } = await supabase
      .from('educadores')
      .select(`
        *,
        ramas:id_rama(id, nombre)
      `)
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return {
      ...data,
      email: user.email
    } as Profile;
  } catch (err: any) {
    console.error('Error obteniendo el perfil:', err.message)
    return null
  }
}