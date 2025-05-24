'use client'

import { useState } from "react"
import { createBeneficiario } from "@/lib/api";
import styles from './styles.module.css'
import Spinner from '../spinner/Spinner';
import { Beneficiario } from '@/lib/supabase';
import BeneficiariosForm from "../beneficiariosForm/BeneficiariosForm";

interface BeneficiarioFormInput {
    nombre: string,
    nacimiento: string,
    genero: string,
    rama: string | number,
    progresion: string | number,
    fecha_cambio_progresion?: string
}

export default function NewBeneficiario({ 
    onCreate,
}: {
    onCreate?: (beneficiario: Beneficiario) => void,
}) {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const handleSaveBeneficiario = async (payload: BeneficiarioFormInput) => {
        setIsLoading(true);
        try {
            const data = await createBeneficiario(payload);
            onCreate && onCreate(data);

            setIsLoading(false);
            return {success: true};
        } catch (e) {
            console.log('ERROR Saving protagonista data', e);
            setIsLoading(false);
            return {success: false, error: e}
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
        <div className={`w-full max-w-[700px] fixed bg-white rounded-2xl p-4 z-50 ${styles.modal}`}>
            <div className="relative">
                {isLoading && <div className='absolute inset-0 bg-white/50 flex items-center justify-center'>
                    <Spinner styles={{
                        border: 'solid 2px rgba(0,0,0,0.1)',
                        borderLeftColor: 'var(--color-primary)'
                    }} />
                </div>}
                
                <h3 className='text-3xl font-medium mt-2 mb-1'>Nuevo Protagonista</h3>
                <p className='text-sm mb-4'>Completá el siguiente formulario para dar de alta a un nuevo protagonista</p>
                
                <BeneficiariosForm
                    beneficiarioCallback={handleSaveBeneficiario}
                    styles={styles}
                />
            </div>
        </div>
        </>
        }
        </>
    )
}
