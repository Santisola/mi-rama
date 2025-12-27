'use client'
import NewBeneficiario from '@/components/newBeneficiario/NewBeneficiario';
import { Beneficiario } from '@/lib/supabase';
import { SquarePen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal/Modal';
import { deleteBeneficiario, getBeneficiarios } from '@/lib/api';

const getRamaClasses = (ramaId : string | number) => {
	switch (ramaId) {
		case 1:
			return 'bg-amber-400 text-white font-semibold';
		case 2:
			return 'bg-green-700 text-white font-semibold';
		case 3:
			return 'bg-blue-800 text-white font-semibold';
		case 4:
			return 'bg-red-700 text-white font-semibold';
		default:
			return '';
	}
}

export default function BeneficiariosTable({beneficiarios}: {beneficiarios: Beneficiario[]}) {
	const [beneficiariosToList, setBeneficiariosToList] = useState<Beneficiario[]>([...beneficiarios]);
	const [filteredByRama, setFilteredByRama] = useState<Beneficiario[]>([...beneficiarios]);
	const [displayedBeneficiarios, setDisplayedBeneficiarios] = useState<Beneficiario[]>([...beneficiarios]);
	const [selectedRama, setSelectedRama] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [ramas, setRamas] = useState<{id: number, nombre: string}[]>([]);

	const [protagonistaToDelete, setProtagonistaToDelete] = useState<null | Beneficiario>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [deleteError, setDeleteError] = useState<null | string>(null)

	const router = useRouter();

	// Extract unique ramas from beneficiarios
	useEffect(() => {
		const uniqueRamas = beneficiariosToList.reduce((acc, beneficiario) => {
			if (beneficiario.ramas && !acc.some(rama => rama.id === beneficiario.ramas?.id)) {
				acc.push({
					id: beneficiario.ramas.id,
					nombre: beneficiario.ramas.nombre
				});
			}
			return acc;
		}, [] as {id: number, nombre: string}[]);
		
		setRamas(uniqueRamas);
	}, [beneficiariosToList]);

	// Filter by rama
	useEffect(() => {
		if (selectedRama === 'all') {
			setFilteredByRama(beneficiariosToList);
		} else {
			const filtered = beneficiariosToList.filter(
				beneficiario => beneficiario.ramas?.id === parseInt(selectedRama)
			);
			setFilteredByRama(filtered);
		}
	}, [selectedRama, beneficiariosToList]);

	// Filter by name search on top of rama filter
	useEffect(() => {
		if (!searchTerm.trim()) {
			setDisplayedBeneficiarios(filteredByRama);
		} else {
			const searchTermLower = searchTerm.toLowerCase();
			const filtered = filteredByRama.filter(
				beneficiario => beneficiario.nombre.toLowerCase().includes(searchTermLower)
			);
			setDisplayedBeneficiarios(filtered);
		}
	}, [searchTerm, filteredByRama]);

	const beneficiarioCreated = (beneficiario: Beneficiario) => {
		setBeneficiariosToList([...beneficiariosToList, beneficiario]);
	}

	const handleRamaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedRama(e.target.value);
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}

	const handleDelete = async () => {
		setDeleteError(null);
		if (!protagonistaToDelete) return;
		setIsDeleting(true);
		const { nombre } = protagonistaToDelete
		try {
			await deleteBeneficiario(protagonistaToDelete.id);
			// Refetch beneficiarios y actualiza el listado
			const nuevos = await getBeneficiarios();
			setBeneficiariosToList(nuevos);
			setProtagonistaToDelete(null);
		} catch (e) {
			console.error('Error al borrar protagonista =>', e)
			setDeleteError(`Oops! Ocurrió un error al intentar borrar a ${nombre}, por favor intentá de nuevo`);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
	<>
	<div className='flex justify-between items-center my-4'>
        <h2 className='my-4 text-2xl'>Protagonistas</h2>
        <NewBeneficiario onCreate={beneficiarioCreated} />
	</div>
	
	<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
		<div>
			<label htmlFor="rama-filter" className="block text-sm font-medium text-gray-700 mb-1">
				Filtrar por Rama:
			</label>
			<select
				id="rama-filter"
				className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
				value={selectedRama}
				onChange={handleRamaChange}
			>
				<option value="all">Todas las ramas</option>
				{ramas.map(rama => (
					<option key={rama.id} value={rama.id.toString()}>
						{rama.nombre}
					</option>
				))}
			</select>
		</div>
		
		<div>
			<label htmlFor="name-search" className="block text-sm font-medium text-gray-700 mb-1">
				Buscar por nombre:
			</label>
			<input
				type="text"
				id="name-search"
				className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
				placeholder="Ingrese nombre a buscar..."
				value={searchTerm}
				onChange={handleSearchChange}
			/>
		</div>
	</div>
	
	<div className='relative'>
		<div className='overflow-x-auto'>
			<div className='bg-white shadow-sm rounded-lg overflow-hidden'>
				<table className="w-full text-sm text-left text-gray-600">
				<thead className="bg-gradient-to-r from-primary/5 to-transparent">
				<tr>
					<th scope="col" className="px-4 py-3 text-left font-medium text-gray-700">Nombre</th>
					<th scope="col" className="px-4 py-3 text-left font-medium text-gray-700">Rama</th>
					<th scope="col" className="px-4 py-3 text-left font-medium text-gray-700">Progresión</th>
					<th scope="col" className="px-4 py-3 text-left font-medium text-gray-700">Último cambio</th>
					<th scope="col" className="px-4 py-3 text-center font-medium text-gray-700">Acciones</th>
				</tr>
				</thead>
				<tbody>
				{displayedBeneficiarios.map((beneficiario, idx) => (
					<tr
						key={beneficiario.id}
						className={`transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
					>
					<td
						scope="row"
						className="px-4 py-3 font-medium text-gray-900 cursor-pointer"
						onClick={() => router.push(`/protagonista/${beneficiario.id}`)}
					>
						<div className='flex flex-col'>
							<span className='text-gray-900'>{beneficiario.nombre}</span>
							<small className='text-gray-500'>{beneficiario.nacimiento}</small>
						</div>
					</td>
					<td className="px-4 py-3">
						<strong className={`rounded-full py-1 px-3 text-xs ${getRamaClasses(beneficiario.id_rama)}`}>{beneficiario.ramas?.nombre || '-'}</strong>
					</td>
					<td className="px-4 py-3 text-sm text-gray-700">{beneficiario.progresiones?.nombre || '-'}</td>
					<td className="px-4 py-3 text-sm text-gray-700">{beneficiario.fecha_cambio_progresion || '-'}</td>
					<td className="px-4 py-3 text-center">
						<div className='inline-flex items-center justify-center gap-2'>
							<button className='cursor-pointer p-2 rounded-md hover:bg-primary/10 transition text-primary' onClick={() => router.push(`/protagonista/${beneficiario.id}`)} aria-label={`Editar ${beneficiario.nombre}`}>
								<SquarePen size={18} />
							</button>
							<button className='cursor-pointer p-2 rounded-md hover:bg-red-50 transition text-red-500' onClick={() => setProtagonistaToDelete(beneficiario)} aria-label={`Eliminar ${beneficiario.nombre}`}>
								<Trash2 size={18} />
							</button>
						</div>
					</td>
					</tr>
				))}
				{displayedBeneficiarios.length === 0 && (
					<tr>
						<td colSpan={5} className="px-4 py-6 text-center text-gray-500">
							No se encontraron beneficiarios con los filtros aplicados
						</td>
					</tr>
				)}
				</tbody>
				</table>
			</div>
		</div>
	</div>
	<Modal showModal={protagonistaToDelete !== null} closeModal={() => setProtagonistaToDelete(null)}>
		<>
		<h3 className='my-4 text-2xl'>Estas borrando a {protagonistaToDelete?.nombre}</h3>
		<p>Esta acción es irreversible ¡No hay vuelta atrás!</p>
		<div className="flex justify-end items-center gap-4 mt-7">
			<button
				onClick={() => setProtagonistaToDelete(null)}
				disabled={isDeleting}
				className='font-semibold text-gray-700 cursor-pointer transition-all hover:underline'
			>Cancelar</button>
			<button
				onClick={() => handleDelete()}
				className='bg-red-500 text-white font-medium px-5 py-2 rounded-4xl cursor-pointer'
			>{isDeleting ? 'Borrando...' : `Borrar a ${protagonistaToDelete?.nombre}`}</button>
		</div>
		{deleteError && <p>{deleteError}</p>}
		</>
	</Modal>
	</>
  )
}
