import LoginForm from '@/components/loginForm/LoginForm';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (session?.user) {
    redirect('/protagonistas');
  }

  return (
    <main className='container mx-auto px-2 py-8'>
        <h2 className='text-3xl'>Gestion de mi rama</h2>
        <p>¡Accedé al sistema para llevar la gestión de la progresion personal y el estado de tu rama!</p>
        
        <LoginForm />
    </main>
  );
}
