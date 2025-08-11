import { supabaseAuth, supabase } from './supabase';

export async function signInWithEmail({email, password}: {email: string, password: string}) {
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

export async function signUpNewUser({email, password}: {email: string, password: string}) {
    try {
        const { data, error } = await supabaseAuth.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: '/protagonistas',
            },
        })
    
        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error registrando usuario!', error);
        return { error: 'Error registrando usuario. Por favor, intente nuevamente.' };
    }
}

export async function getCurrentUserProfile(supabaseClient: any, userId: string) {
  try {
    const { data: profile, error: profileError } = await supabaseClient
      .from('educadores')
      .select(`
        *,
        ramas:id_rama(id, nombre)
      `)
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    return profile
  } catch (err: any) {
    console.error('Error obteniendo el perfil:', err.message)
    return null
  }
}
