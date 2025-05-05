import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs';
import Link from 'next/link';

export default async function Home() {
  return (
    <main className='container mx-auto px-2 py-8'>
        <h2 className='text-3xl'>Gestion de mi rama</h2>
        <p>¡Accedé al sistema para llevar la gestión de la progresion personal y el estado de tu rama!</p>
        
        <SignedIn>
          <Link href={'/protagonistas'} className='block w-fit mt-6 bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all'>Ver protagonistas</Link>
        </SignedIn>

        <SignedOut>
          <SignInButton
            fallbackRedirectUrl={'/protagonistas'}
            mode="modal"
          >
            <button className='mt-6 bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all'>Iniciá Sesión</button>
          </SignInButton>
          <p className='text-sm mt-2'>¿No tenés cuenta? <SignUpButton><button className='font-bold text-primary hover:text-primary-focus cursor-pointer'>¡Registrate!</button></SignUpButton></p>
        </SignedOut>
    </main>
  );
}
