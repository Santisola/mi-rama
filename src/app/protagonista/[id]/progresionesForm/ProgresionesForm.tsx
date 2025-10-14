'use client'

import Spinner from '@/components/spinner/Spinner';
import { getProgresiones, updateBeneficiario } from '@/lib/api';
import { Beneficiario } from '@/lib/supabase';
import { useEffect, useMemo, useState } from 'react'

interface FormStatus {
	error: boolean;
	message: string;
}

export default function ProgresionesForm({protagonista, onEdit}: {protagonista: Beneficiario, onEdit?: () => void}) {
	const [progresiones, setProgresiones] = useState<any[]>([]);
	const [rama, setRama] = useState<string>('');
	const [selectedProgresion, setSelectedProgresion] = useState<string | null>()
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [formStatus, setFormStatus] = useState<FormStatus>({
		error: false,
		message: ''
	});
	
	useEffect(() => {
		getProgresiones().then(res => {
			setProgresiones(res);
			setRama(protagonista.ramas?.id.toString() || '');
		});
	}, []);

	const filteredProgresiones = useMemo(() => {
		if (!rama || rama === '' || rama === '...') return progresiones;
		return progresiones.filter(progresion => progresion.id_rama == rama);
	}, [rama, progresiones]);

	const handleProgresionUpdate = async () => {
		setIsLoading(true);
		setFormStatus({
			error: false,
			message: ''
		})

		try {	
			if (!selectedProgresion) {
				setFormStatus({
					error: true,
					message: 'Seleccione una progresión'
				})
				return;
			}
			if (!rama) {
				setFormStatus({
					error: true,
					message: 'Seleccione una rama'
				})
				return;
			}
			
			const selectedProgresionId = parseInt(selectedProgresion);
			const selectedRamaId = parseInt(rama);
			
			const data = {
				id: protagonista.id,
				rama: selectedRamaId,
				progresion: selectedProgresionId,
				fecha_cambio_progresion: (new Date()).toLocaleDateString()
			}
		
			const newPibe = await updateBeneficiario(data);
			setIsEditing(false);
			setIsLoading(false);
			setFormStatus({
				error: false,
				message: ''
			})

			if (onEdit) onEdit();
			return;
		} catch (error) {
			console.log(error);
			setFormStatus({
				error: true,
				message: 'Ocurrió un error con el formulario, por favor intenta de nuevo'
			});
			setIsLoading(false);
		}
	}
	
	return (
		<>
		{!isEditing &&
		<button
			onClick={() => setIsEditing(true)}
			className='mt-4 font-semibold text-primary cursor-pointer transition-all hover:text-primary-focus hover:underline'
		>Cambiar Progresion / Rama</button>
		}
		
		{(isEditing && progresiones.length > 0) &&
		<>
			<div className="form-group flex flex-col mt-4">
				<label htmlFor="rama">Rama</label>
				<select
					name="rama"
					id="rama"
					disabled={isLoading}
					onChange={ev => setRama(ev.target.value)}
					className='mt-1 w-fit border min-w-3xs border-gray-300 rounded-md py-2 focus:outline-none focus:ring focus:border-blue-300'
				>
					<option selected disabled>...</option>
					<option value="1" selected={protagonista.ramas?.id === 1}>Manada</option>
					<option value="2" selected={protagonista.ramas?.id === 2}>Unidad</option>
					<option value="3" selected={protagonista.ramas?.id === 3}>Caminantes</option>
					<option value="4" selected={protagonista.ramas?.id === 4}>Rovers</option>
				</select>
			</div>

			<div className='form-group flex flex-col mt-4'>
				<label htmlFor="progresion">Progresión</label>
				<select
					name="progresion"
					id="progresion"
					disabled={isLoading}
					onChange={ev => setSelectedProgresion(ev.target.value)}
					className='mt-1 w-fit border min-w-3xs border-gray-300 rounded-md py-2 focus:outline-none focus:ring focus:border-blue-300'
				>
					<option selected disabled>...</option>
					{filteredProgresiones.map((progresion, i) => (
						<option key={i} value={progresion.id}>{progresion.nombre}</option>
					))}
				</select>
			</div>
			
			<div className='mt-6 flex gap-4 items-center'>
				<button
					onClick={() => setIsEditing(false)}
					disabled={isLoading}
					className='font-semibold text-primary cursor-pointer transition-all hover:text-primary-focus hover:underline'
				>Cancelar</button>
				<button
					className='bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all disabled:bg-primary-faded disabled:cursor-default'
					disabled={Boolean(!selectedProgresion) || isLoading}
					onClick={handleProgresionUpdate}
				>{isLoading ? <Spinner styles={{
					width: '20px',
					height: '20px',
					border: 'solid 2px rgba(0,0,0,0.1)',
					borderLeftColor: '#fff'
				}} /> : 'Guardar'}</button>
			</div>
			{formStatus.error && <>
				<p className='text-red-500 mt-4'>{formStatus.message}</p>
			</>}
		</>
		}
		</>
	)
}
