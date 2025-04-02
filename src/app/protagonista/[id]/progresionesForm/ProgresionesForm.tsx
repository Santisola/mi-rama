'use client'

import { getProgresiones } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react'

export default function ProgresionesForm() {
	const [progresiones, setProgresiones] = useState<any[]>([]);
	const [rama, setRama] = useState<string>('');
	const [selectedProgresion, setSelectedProgresion] = useState<string | null>()
	const [isEditing, setIsEditing] = useState<boolean>(false);
	
	useEffect(() => {
		getProgresiones().then(res => {
			setProgresiones(res);
		});
	}, []);

	const filteredProgresiones = useMemo(() => {
		if (!rama || rama === '' || rama === '...') return progresiones;
		return progresiones.filter(progresion => progresion.id_rama == rama);
	}, [rama, progresiones]);
	
	return (
		<>
		{!isEditing &&
		<button
			onClick={() => setIsEditing(true)}
			className='mt-4 font-semibold text-primary cursor-pointer transition-all hover:text-primary-focus hover:underline'
		>Cambiar Progresion</button>
		}
		
		{(isEditing && progresiones.length > 0) &&
		<>
			<div className="form-group flex flex-col mt-4">
				<label htmlFor="rama">Rama</label>
				<select
					name="rama"
					id="rama"
					onChange={ev => setRama(ev.target.value)}
					className='mt-1 w-fit border min-w-3xs border-gray-300 rounded-md py-2 focus:outline-none focus:ring focus:border-blue-300'
				>
					<option selected disabled>...</option>
					<option value="1">Manada</option>
					<option value="2">Unidad</option>
					<option value="3">Caminantes</option>
					<option value="4">Rovers</option>
				</select>
			</div>

			<div className='form-group flex flex-col mt-4'>
				<label htmlFor="progresion">Progresión</label>
				<select
					name="progresion"
					id="progresion"
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
				<button onClick={() => setIsEditing(false)} className='font-semibold text-primary cursor-pointer transition-all hover:text-primary-focus hover:underline'>Cancelar</button>
				<button className='bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all disabled:bg-primary-faded disabled:cursor-default' disabled={Boolean(!selectedProgresion)} >Guardar</button>
			</div>
		</>
		}
		</>
	)
}
