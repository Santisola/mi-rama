import { supabase } from './supabase';

export async function signInWithEmail({email, password}: {email: string, password: string}) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
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
        const { data, error } = await supabase.auth.signUp({
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