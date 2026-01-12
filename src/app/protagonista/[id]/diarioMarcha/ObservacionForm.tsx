'use client';

import { useState, useEffect } from 'react';
import { createObservacion } from '@/lib/api';
import type { ObservacionFormInput } from '@/types/diario-marcha';
import { supabaseAuth } from '@/lib/supabase';
import styles from './diario-marcha.module.css';

interface ObservacionFormProps {
    diarioCompetenciaId: number;
    onSuccess: () => void;
}

export default function ObservacionForm({
    diarioCompetenciaId,
    onSuccess,
}: ObservacionFormProps) {
    const [formData, setFormData] = useState<ObservacionFormInput>({
        comentario: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [educadorId, setEducadorId] = useState<string | null>(null);

    useEffect(() => {
        const getEducadorId = async () => {
            const { data: { user } } = await supabaseAuth.auth.getUser();
            if (user) {
                setEducadorId(user.id);
            }
        };
        getEducadorId();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.comentario.trim()) {
            setError('La observación es obligatoria');
            return;
        }

        if (!educadorId) {
            setError('No se pudo identificar al educador');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await createObservacion(diarioCompetenciaId, educadorId, formData);

            // Reset form
            setFormData({
                comentario: '',
            });

            onSuccess();
        } catch (err) {
            console.error('Error creating observacion:', err);
            setError('Error al crear la observación');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h5 className={styles.formTitulo}>Nueva Observación</h5>

            {error && <div className={styles.formError}>{error}</div>}

            <div className={styles.formGroup}>
                <label htmlFor="observacion" className={styles.formLabel}>
                    Observación del Educador
                </label>
                <textarea
                    id="comentario"
                    value={formData.comentario}
                    onChange={(e) => setFormData({ comentario: e.target.value })}
                    className={styles.formTextarea}
                    rows={4}
                    placeholder="Escribe tu observación sobre el progreso del caminante..."
                    disabled={submitting}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className={styles.btnSubmit}
            >
                {submitting ? 'Guardando...' : 'Guardar Observación'}
            </button>
        </form>
    );
}
