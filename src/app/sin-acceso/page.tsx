import Image from 'next/image';
import src from '../assets/sin-auth.png'

export default function page() {
  return (
	<main className='container mx-auto px-2 py-8'>
		<h2 className='text-3xl mb-4'>¡Sin acceso!</h2>
		<p>Oops! No tenés acceso para ver este contenido. <br />Si recién te registraste el proceso de asignacion de tu rol puede demorar.</p>
		<Image
			src={src}
			alt='Perro en la puerta sin acceso'
			width={350}
			className='mt-4 rounded-3xl'
		/>
	</main>
  )
}
