'use client'
import React, { useState } from 'react'
import { Beneficiario, BeneficiarioFormInput } from '@/lib/supabase'
import styles from '../styles.module.css'
import BeneficiariosForm from '@/components/beneficiariosForm/BeneficiariosForm';
import { updateBeneficiario } from '@/lib/api';
import Spinner from '@/components/spinner/Spinner';

export default function EditProtagonista({beneficiario, onEdit}: {beneficiario: Beneficiario, onEdit?: () => void}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSaveBeneficiario = async (payload: BeneficiarioFormInput) => {
        setIsLoading(true);
        payload.id = beneficiario.id
        try {
            const data = await updateBeneficiario(payload);
            console.log('RESPONSE', data);
            setIsLoading(false);
            setIsEditing(false);
            if (onEdit) onEdit();
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
                className={`mb-8 cursor-pointer text-sm font-semibold ${styles.editButton}`}
                onClick={() => setIsEditing(true)}
            >Editar datos</button>

            {isEditing &&
            <>
            <div onClick={() => setIsEditing(false)} className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.15)] transition ${isEditing ? 'max-h-dvh opacity-100' : 'max-h-0 opacity-0'}`}></div>
            <div className={`w-full max-w-[700px] fixed bg-white rounded-2xl p-4 z-50 ${styles.modal}`}>
                <div className="relative">
                {isLoading && <div className='absolute inset-0 bg-white/50 flex items-center justify-center'>
                    <Spinner styles={{
                        border: 'solid 2px rgba(0,0,0,0.1)',
                        borderLeftColor: 'var(--color-primary)'
                    }} />
                </div>}
                <BeneficiariosForm beneficiario={beneficiario} beneficiarioCallback={handleSaveBeneficiario} />
                </div>
            </div>
            </>
            }
            </>
    )
}
