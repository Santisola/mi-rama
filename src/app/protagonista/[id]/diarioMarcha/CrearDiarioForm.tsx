'use client';

import { useState, useEffect } from 'react';
import { getEtapas, createDiarioMarcha } from '@/lib/api';
import type { Etapa } from '@/types/diario-marcha';
import styles from './diario-marcha.module.css';

interface CrearDiarioFormProps {
    beneficiarioId: number;
    ramaId: number;
    onSuccess: () => void;
}

export default function CrearDiarioForm({
    beneficiarioId,
    ramaId,
    onSuccess,
}: CrearDiarioFormProps) {
    const [etapas, setEtapas] = useState<Etapa[]>([]);
    const [selectedEtapaId, setSelectedEtapaId] = useState<number | null>(null);
    const [reflexionInicial, setReflexionInicial] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEtapas = async () => {
            try {
                const data = await getEtapas(ramaId);
                setEtapas(data);
                if (data.length > 0) {
                    setSelectedEtapaId(data[0].id);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching etapas:', error);
                setLoading(false);
            }
        };
        fetchEtapas();
    }, [ramaId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEtapaId) {
            setError('Debes seleccionar una etapa inicial');
            return;
        }

        if (!reflexionInicial.trim()) {
            setError('La reflexión inicial es obligatoria');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await createDiarioMarcha(beneficiarioId, selectedEtapaId, reflexionInicial);
            onSuccess();
        } catch (err) {
            console.error('Error creating diario:', err);
            setError('Error al crear el diario de marcha');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loading}>Cargando...</div>;

    return (
        <div className={styles.crearDiarioContainer}>
            <div className={styles.crearDiarioHeader}>
                <h3>Iniciar Nuevo Diario de Marcha</h3>
                <p>Comienza el seguimiento del camino para este caminante.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.formError}>{error}</div>}

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Etapa Inicial</label>
                    <div className={styles.etapaGrid}>
                        {etapas.map((etapa) => (
                            <button
                                key={etapa.id}
                                type="button"
                                onClick={() => setSelectedEtapaId(etapa.id)}
                                className={`${styles.etapaBtn} ${selectedEtapaId === etapa.id ? styles.etapaBtnActive : ''}`}
                                disabled={submitting}
                            >
                                {etapa.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="reflexionInicial" className={styles.formLabel}>
                        Reflexión Inicial
                    </label>
                    <textarea
                        id="reflexionInicial"
                        value={reflexionInicial}
                        onChange={(e) => setReflexionInicial(e.target.value)}
                        className={styles.formTextarea}
                        rows={5}
                        placeholder="Escribe los desafíos y expectativas para este nuevo camino..."
                        disabled={submitting}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className={styles.btnSubmit}
                >
                    {submitting ? 'Iniciando...' : 'Iniciar Diario de Marcha'}
                </button>
            </form>
        </div>
    );
}
