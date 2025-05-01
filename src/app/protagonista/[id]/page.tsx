import { getBeneficiario } from '@/lib/api';
import Link from 'next/link';
import ProgresionesForm from './progresionesForm/ProgresionesForm';
import { ChevronLeft } from 'lucide-react';

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params;
	const {
		nombre,
		nacimiento,
		...rest
	} = await getBeneficiario(id);
	
	return (
	<article>
		<div className='container px-2 m-auto py-4'>
			<Link href={'/'} className='block mb-4 text-sm flex items-center font-medium'><ChevronLeft /> Volver</Link>
			<strong className='text-white bg-primary px-3 py-1 rounded-4xl text-sm'>{rest.ramas?.nombre || '-'}</strong>
			<h2 className='text-4xl font-medium mt-2 mb-1'>{nombre}</h2>
			<p className='text-sm mb-8'>{nacimiento}</p>
			<p>Progresion actual: <strong>{rest.progresiones?.nombre || '-'}</strong></p>

			<ProgresionesForm
				protagonista={{
					nombre,
					nacimiento,
					...rest
				}}
			/>
		</div>
	</article>
	)
}