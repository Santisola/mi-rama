'use client';

import { useState, useEffect } from 'react';
import { getCompetenciasDisponibles, asignarCompetencias } from '@/lib/api';
import type { Competencia } from '@/types/diario-marcha';
import { AREA_CONFIG } from '@/types/diario-marcha';
import styles from './diario-marcha.module.css';

interface SelectorCompetenciasProps {
    diarioId: number;
    ramaId: number;
    onSelected: () => void;
    onCancel: () => void;
}

export default function SelectorCompetencias({
    diarioId,
    ramaId,
    onSelected,
    onCancel,
}: SelectorCompetenciasProps) {
    const [disponibles, setDisponibles] = useState<Competencia[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDisponibles = async () => {
            try {
                const data = await getCompetenciasDisponibles(ramaId, diarioId);
                setDisponibles(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching available competencies:', error);
                setLoading(false);
            }
        };
        fetchDisponibles();
    }, [ramaId, diarioId]);

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (selectedIds.length === 0) return;
        try {
            setSaving(true);
            await asignarCompetencias(diarioId, selectedIds);
            onSelected();
        } catch (error) {
            console.error('Error assigning competencies:', error);
            alert('Error al asignar las competencias');
        } finally {
            setSaving(false);
        }
    };

    // Group by area
    const porArea = disponibles.reduce((acc, comp) => {
        if (!acc[comp.area]) acc[comp.area] = [];
        acc[comp.area].push(comp);
        return acc;
    }, {} as Record<string, Competencia[]>);

    if (loading) return <p>Cargando competencias disponibles...</p>;

    return (
        <div className={styles.selectorCompetencias}>
            <div className={styles.selectorHeader}>
                <h4>Asignar Competencias</h4>
                <p>Selecciona las competencias a trabajar en esta etapa</p>
            </div>

            <div className={styles.competenciasChecklist}>
                {Object.entries(porArea).map(([area, items]) => {
                    const config = AREA_CONFIG[area as keyof typeof AREA_CONFIG];
                    return (
                        <div key={area} className={styles.areaCheckGroup}>
                            <h5 style={{ color: config.color }}>{config.icono} {config.nombre}</h5>
                            <div className={styles.checkGrid}>
                                {items.map(comp => (
                                    <label key={comp.id} className={styles.checkLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(comp.id)}
                                            onChange={() => toggleSelection(comp.id)}
                                            disabled={saving}
                                        />
                                        <span className={styles.checkText}>
                                            <strong>{comp.nombre}</strong>
                                            <small>{comp.descripcion.substring(0, 60)}...</small>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.selectorActions}>
                <button onClick={onCancel} className={styles.btnCancel} disabled={saving}>
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    className={styles.btnConfirm}
                    disabled={saving || selectedIds.length === 0}
                >
                    {saving ? 'Guardando...' : `Asignar ${selectedIds.length} Competencia(s)`}
                </button>
            </div>
        </div>
    );
}
