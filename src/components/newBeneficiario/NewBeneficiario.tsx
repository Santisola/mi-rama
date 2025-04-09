'use client'

import { useEffect, useMemo, useState } from "react"
import { getProgresiones } from "@/lib/api";
import styles from './styles.module.css'

export default function NewBeneficiario() {
    const [showModal, setShowModal] = useState(false);
	const [progresiones, setProgresiones] = useState<any[]>([]);

    useEffect(() => {
        getProgresiones().then(res => {
            setProgresiones(res);
        });
    }, []);
    
    const filteredProgresiones = useMemo(() => {
        return progresiones;
        /* if (!rama || rama === '' || rama === '...') return progresiones;
        return progresiones.filter(progresion => progresion.id_rama == rama); */
    }, [progresiones]);
    
    return (
        <>
        <button
            className='bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all'
            onClick={() => setShowModal(true)}
        >
            Nuevo protagonista
        </button>
        
        <div onClick={() => setShowModal(false)} className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.15)] transition ${showModal ? 'max-h-dvh opacity-100' : 'max-h-0 opacity-0'}`}></div>
        {showModal &&  
        <>
        <div className={`w-full max-w-[700px] absolute bg-white rounded-2xl p-4 z-50 ${styles.modal}`}>
            <form action="#">
                <div className={`mb-4 ${styles.formGroup}`}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="mt-1 border min-w-3xs border-gray-300 rounded-md py-1 px-1 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className={`mb-4 ${styles.formGroup}`}>
                    <label htmlFor="nacimiento">Nacimiento</label>
                    <input
                        type="date"
                        name="nacimiento"
                        id="nacimiento"
                        className="mt-1 border min-w-3xs border-gray-300 rounded-md py-1 px-1 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className={`mb-4 ${styles.formGroup}`}>
                    <label htmlFor="genero">Género</label>
                    <select
                        name="genero"
                        id="genero"
                        className="mt-1 border min-w-3xs border-gray-300 rounded-md py-1 px-1 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option>Masculino</option>
                        <option>Femenino</option>
                        <option value={0}>Yyy que se yo</option>
                    </select>
                </div>
                <div className="form-group flex flex-col mt-4">
                    <label htmlFor="rama">Rama</label>
                    <select
                        name="rama"
                        id="rama"
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
                        className='mt-1 w-fit border min-w-3xs border-gray-300 rounded-md py-2 focus:outline-none focus:ring focus:border-blue-300'
                    >
                        <option selected disabled>...</option>
                        {filteredProgresiones.map((progresion, i) => (
                            <option key={i} value={progresion.id}>{progresion.nombre}</option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
        </>
        }
        </>
    )
}
