'use client'

import { FormEvent, useEffect, useMemo, useState } from "react"
import { createBeneficiario, getProgresiones } from "@/lib/api";
import styles from './styles.module.css'
import Spinner from '../spinner/Spinner';

interface BeneficiarioFormInput {
    nombre: string,
    nacimiento: string,
    genero: string,
    rama: string | number,
    progresion: string | number
}

interface FormStatus {
    error: boolean,
    message: string | null,
    loading: boolean
}

export default function NewBeneficiario() {
    const [showModal, setShowModal] = useState(false);
	const [progresiones, setProgresiones] = useState<any[]>([]);
    const [formState, setFormState] = useState<FormStatus>({
        error: false,
        message: null,
        loading: false
    })
    const [formData, setFormData] = useState<BeneficiarioFormInput>({
        nombre: '',
        nacimiento: '',
        genero: '',
        rama: '',
        progresion: ''
    })
    const [errors, setErrors] = useState<any>({
        nombre: '',
        nacimiento: '',
        genero: '',
        rama: '',
        progresion: ''
    });

    useEffect(() => {
        getProgresiones().then(res => {
            setProgresiones(res);
        });
    }, []);
    
    const filteredProgresiones = useMemo(() => {
        if (!formData.rama || formData.rama === '' || formData.rama === '...') return progresiones;
        return progresiones.filter(progresion => progresion.id_rama == formData.rama);
    }, [progresiones, formData]);
    
    const handleChange = (ev: any) => {
        const {
            target: {
                value,
                name
            }
        } = ev;

        setFormData({
            ...formData,
            [name]: value
        })
    }
    
    const handleSaveBeneficiario = async (ev:FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setFormState({
            error: false,
            message: null,
            loading: true
        })
        console.log('FORM DATA', formData);

        const errors: any = {};

        if (formData.nombre === '') {
            errors.nombre = 'El nombre es requerido';
        }

        if (formData.nacimiento === '') {
            errors.nacimiento = 'La fecha de nacimiento es requerida';
        }

        if (formData.genero === '') {
            errors.genero = 'El género es requerido';
        }

        if (formData.rama === '' || formData.rama === '...') {
            errors.rama = 'La rama es requerida';
        }

        if (formData.progresion === '' || formData.progresion === '...') {
            errors.progresion = 'La progresión es requerida';
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setFormState({
                error: true,
                message: 'Hay errores en el formulario',
                loading: false
            })
            return;
        }

        try {
            const data = await createBeneficiario(formData);
            console.log('EXITOOO', data)
        } catch (e) {
            console.error('Error guardando al beneficiario', e)
        }
    }
    
    
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
            <div className="relative">
                {formState.loading && <div className='absolute inset-0 bg-white/50 flex items-center justify-center'>
                    <Spinner styles={{
                        border: 'solid 2px rgba(0,0,0,0.1)',
                        borderLeftColor: 'var(--color-primary)'
                    }} />
                </div>}
                
                <h3 className='text-3xl font-medium mt-2 mb-1'>Nuevo Protagonista</h3>
                <p className='text-sm mb-4'>Completá el siguiente formulario para dar de alta a un nuevo protagonista</p>
                <form action="#" onSubmit={ev => handleSaveBeneficiario(ev)}>
                    <div className={`mb-4 ${styles.formGroup}`}>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`mt-1 border min-w-3xs border-gray-300 rounded-md py-1 px-1 focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre && 'border-red-500'}`}
                        />
                        {errors.nombre && <p className='text-red-500 text-sm mt-1'>{errors.nombre}</p>}
                    </div>
                    <div className={`mb-4 ${styles.formGroup}`}>
                        <label htmlFor="nacimiento">Nacimiento</label>
                        <input
                            type="date"
                            name="nacimiento"
                            id="nacimiento"
                            value={formData.nacimiento}
                            onChange={handleChange}
                            className={`mt-1 border min-w-3xs border-gray-300 rounded-md py-1 px-1 focus:outline-none focus:ring focus:border-blue-300 ${errors.nacimiento && 'border-red-500'}`}
                        />
                        {errors.nacimiento && <p className='text-red-500 text-sm mt-1'>{errors.nacimiento}</p>}
                    </div>
                    <div className={`mb-4 ${styles.formGroup}`}>
                        <label htmlFor="genero">Género</label>
                        <select
                            name="genero"
                            id="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            className={`mt-1 border min-w-3xs border-gray-300 rounded-md py-1 px-1 focus:outline-none focus:ring focus:border-blue-300 ${errors.genero && 'border-red-500'}`}
                        >   
                            <option selected>...</option>
                            <option>Masculino</option>
                            <option>Femenino</option>
                            <option value={0}>Yyy que se yo</option>
                        </select>
                        {errors.genero && <p className='text-red-500 text-sm mt-1'>{errors.genero}</p>}
                    </div>
                    <div className="form-group flex flex-col mt-4">
                        <label htmlFor="rama">Rama</label>
                        <select
                            name="rama"
                            id="rama"
                            value={formData.rama}
                            onChange={handleChange}
                            className={`mt-1 w-fit border min-w-3xs border-gray-300 rounded-md py-2 focus:outline-none focus:ring focus:border-blue-300 ${errors.rama && 'border-red-500'}`}
                        >
                            <option selected>...</option>
                            <option value="1">Manada</option>
                            <option value="2">Unidad</option>
                            <option value="3">Caminantes</option>
                            <option value="4">Rovers</option>
                        </select>
                        {errors.rama && <p className='text-red-500 text-sm mt-1'>{errors.rama}</p>}
                    </div>

                    <div className='form-group flex flex-col mt-4'>
                        <label htmlFor="progresion">Progresión</label>
                        <select
                            name="progresion"
                            id="progresion"
                            value={formData.progresion}
                            onChange={handleChange}
                            className={`mt-1 w-fit border min-w-3xs border-gray-300 rounded-md py-2 focus:outline-none focus:ring focus:border-blue-300 ${errors.progresion && 'border-red-500'}`}
                        >
                            <option selected>...</option>
                            {filteredProgresiones.map((progresion, i) => (
                                <option key={i} value={progresion.id}>{progresion.nombre}</option>
                            ))}
                        </select>
                        {errors.progresion && <p className='text-red-500 text-sm mt-1'>{errors.progresion}</p>}
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all disabled:bg-primary-faded disabled:cursor-default">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
        </>
        }
        </>
    )
}
