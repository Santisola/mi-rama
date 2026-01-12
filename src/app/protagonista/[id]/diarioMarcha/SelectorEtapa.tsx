'use client';

import { useState, useEffect } from 'react';
import { getEtapas, updateDiarioEtapa } from '@/lib/api';
import type { Etapa } from '@/types/diario-marcha';
import styles from './diario-marcha.module.css';

interface SelectorEtapaProps {
    diarioId: number;
    ramaId: number;
    currentEtapaId?: number;
    onSelected: () => void;
}

export default function SelectorEtapa({
    diarioId,
    ramaId,
    currentEtapaId,
    onSelected,
}: SelectorEtapaProps) {
    const [etapas, setEtapas] = useState<Etapa[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchEtapas = async () => {
            try {
                const data = await getEtapas(ramaId);
                setEtapas(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching etapas:', error);
                setLoading(false);
            }
        };
        fetchEtapas();
    }, [ramaId]);

    const handleSelect = async (etapaId: number) => {
        try {
            setUpdating(true);
            await updateDiarioEtapa(diarioId, etapaId);
            onSelected();
        } catch (error) {
            console.error('Error updating etapa:', error);
            alert('Error al actualizar la etapa');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p>Cargando etapas...</p>;

    return (
        <div className={styles.selectorEtapa}>
            <h4>Seleccionar Etapa</h4>
            <p className={styles.selectorHint}>Elige la etapa actual del caminante</p>
            <div className={styles.etapaGrid}>
                {etapas.map((etapa) => (
                    <button
                        key={etapa.id}
                        onClick={() => handleSelect(etapa.id)}
                        disabled={updating || currentEtapaId === etapa.id}
                        className={`${styles.etapaBtn} ${currentEtapaId === etapa.id ? styles.etapaBtnActive : ''}`}
                    >
                        {etapa.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
}
