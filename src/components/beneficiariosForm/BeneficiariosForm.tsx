import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { getProgresiones } from '@/lib/api';
import { Beneficiario, BeneficiarioFormInput } from '@/lib/supabase';
import styles from '../newBeneficiario/styles.module.css'

interface FormStatus {
    error: boolean,
    message: string | null,
    loading: boolean
}

export default function BeneficiariosForm({
    beneficiario = null,
    beneficiarioCallback,
}: {
    beneficiario?: Beneficiario | null,
    beneficiarioCallback: (payload: BeneficiarioFormInput) => any
    styles?: any
}) {
    const [formData, setFormData] = useState<BeneficiarioFormInput>({
        nombre: beneficiario?.nombre || '',
        nacimiento: beneficiario?.nacimiento ||  '',
        genero: beneficiario?.genero ||  '',
        rama: beneficiario?.id_rama ||  '',
        progresion: beneficiario?.id_progresion ||  ''
    });
	const [progresiones, setProgresiones] = useState<any[]>([]);
    
    const [formState, setFormState] = useState<FormStatus>({
        error: false,
        message: null,
        loading: false
    });
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

        const errors: any = {};
        
        if(name === 'nombre') {
            if (value !== '') {
                setErrors({ ...errors, nombre: '' })
            } else {
                errors.nombre = 'El nombre es requerido';
            };
        }
        if(name === 'nacimiento') {
            if (value !== '') {
                setErrors({ ...errors, nacimiento: '' })
            } else {
                errors.nacimiento = 'La fecha de nacimiento es requerida';
            };
        }
        if(name === 'genero') {
            if (value !== '') {
                setErrors({ ...errors, genero: '' })
            } else {
                errors.genero = 'El género es requerido';
            };
        }
        if(name === 'rama') {
            if (value !== '' && value !== '...') {
                setErrors({ ...errors, rama: '' })
            } else {
                errors.rama = 'La rama es requerida';
            };
        }
        if(name === 'progresion') {
            if (value !== '' && value !== '...') {
                setErrors({ ...errors, progresion: '' })
            } else {
                errors.progresion = 'La progresión es requerida';
            };
        }
        
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setFormState({
                error: true,
                message: null,
                loading: false
            })
        } else {
            setErrors({
                nombre: '',
                nacimiento: '',
                genero: '',
                rama: '',
                progresion: ''
            });
            setFormState({
                error: false,
                message: null,
                loading: false
            })
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSave = async (ev:FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setFormState({
            error: false,
            message: null,
            loading: true
        })

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
                message: null,
                loading: false
            });
            return;
        }

        try {
            const payload = {
                ...formData,
                fecha_cambio_progresion: (new Date()).toLocaleDateString()
            }
            const status = await beneficiarioCallback(payload);

            if(!status.success) {
                throw Error('Error al guardar datos');
            }

            setFormData({
                nombre: '',
                nacimiento: '',
                genero: '',
                rama: '',
                progresion: ''
            });
            setFormState({
                error: false,
                message: '¡Protagonista guardado con éxito!',
                loading: false
            });
        } catch (e) {
            console.error('Error guardando al beneficiario', e);
            setFormState({
                error: true,
                message: 'Oops! Ocurrió un error al guardar el protagonista, por favor intenta nuevamente.',
                loading: false
            });
        }
    }
    
    return (
        <form action="#" onSubmit={ev => handleSave(ev)}>
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
                <button className="bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all disabled:bg-primary-faded disabled:cursor-default" disabled={formState.error}>Guardar</button>
            </div>
            {
                formState.message && <p className={`text-sm font-bold mt-3 text-center px-2 py-3 rounded-md ${formState.error ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-800'}`}>{formState.message}</p>
            }
        </form>
    )
}
