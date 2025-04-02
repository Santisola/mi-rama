'use client'
import { Beneficiario } from '@/lib/supabase';
import { useRouter } from 'next/navigation'

export default function BeneficiariosTable({beneficiarios}: {beneficiarios: Beneficiario[]}) {
	const router = useRouter();

	return (
	<div className='relative overflow-x-auto'>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
			<thead className="text-xs text-gray-700 uppercase bg-primary-faded">
			<tr>
				<th scope="col" className="px-6 py-3">Nombre</th>
				<th scope="col" className="px-6 py-3">Fecha de nacimiento</th>
				<th scope="col" className="px-6 py-3">Rama</th>
				<th scope="col" className="px-6 py-3">Progresión</th>
			</tr>
			</thead>
			<tbody>
			{beneficiarios.map((beneficiario) => (
				<tr key={beneficiario.id} className="bg-white border-b border-gray-300 transition-all hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/protagonista/${beneficiario.id}`)}>
				<td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{beneficiario.nombre}
				</td>
				<td className="px-6 py-4">{beneficiario.nacimiento}</td>
				<td className="px-6 py-4">{beneficiario.ramas?.nombre || '-'}</td>
				<td className="px-6 py-4">{beneficiario.progresiones?.nombre || '-'}</td>
				</tr>
			))}
			</tbody>
		</table>
	</div>
  )
}
