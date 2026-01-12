'use client';

import { useState } from 'react';
import { createAccion } from '@/lib/api';
import type { AccionFormInput } from '@/types/diario-marcha';
import styles from './diario-marcha.module.css';

interface AccionFormProps {
    diarioCompetenciaId: number;
    onSuccess: () => void;
}

export default function AccionForm({
    diarioCompetenciaId,
    onSuccess,
}: AccionFormProps) {
    const [formData, setFormData] = useState<AccionFormInput>({
        descripcion: '',
        reflexion: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.descripcion.trim() || !formData.reflexion.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await createAccion(diarioCompetenciaId, formData);

            // Reset form
            setFormData({
                descripcion: '',
                reflexion: '',
            });

            onSuccess();
        } catch (err) {
            console.error('Error creating accion:', err);
            setError('Error al crear la acción');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h5 className={styles.formTitulo}>Nueva Acción</h5>

            {error && <div className={styles.formError}>{error}</div>}

            <div className={styles.formGroup}>
                <label htmlFor="descripcion" className={styles.formLabel}>
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="Describe la acción realizada..."
                    disabled={submitting}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="reflexion" className={styles.formLabel}>
                    Reflexión Personal
                </label>
                <textarea
                    id="reflexion"
                    value={formData.reflexion}
                    onChange={(e) => setFormData({ ...formData, reflexion: e.target.value })}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="¿Qué aprendiste? ¿Cómo te sentiste?"
                    disabled={submitting}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className={styles.btnSubmit}
            >
                {submitting ? 'Guardando...' : 'Guardar Acción'}
            </button>
        </form>
    );
}
