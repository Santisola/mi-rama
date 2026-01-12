'use client';

import { useState } from 'react';
import type { DiarioCompetenciaConRelaciones } from '@/types/diario-marcha';
import { AREA_CONFIG } from '@/types/diario-marcha';
import CompetenciaDetail from './CompetenciaDetail';
import { CheckCircle, Circle } from 'lucide-react';
import styles from './diario-marcha.module.css';

interface CompetenciasListProps {
    competencias: DiarioCompetenciaConRelaciones[];
    onRefresh: () => Promise<void>;
}

export default function CompetenciasList({
    competencias,
    onRefresh,
}: CompetenciasListProps) {
    const [selectedCompetencia, setSelectedCompetencia] = useState<DiarioCompetenciaConRelaciones | null>(null);

    // Group competencias by area
    const competenciasPorArea = competencias.reduce((acc, dc) => {
        const area = dc.competencia.area;
        if (!acc[area]) {
            acc[area] = [];
        }
        acc[area].push(dc);
        return acc;
    }, {} as Record<string, DiarioCompetenciaConRelaciones[]>);

    const handleCompetenciaClick = (dc: DiarioCompetenciaConRelaciones) => {
        setSelectedCompetencia(dc);
    };

    const handleCloseDetail = () => {
        setSelectedCompetencia(null);
        onRefresh();
    };

    if (competencias.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No hay competencias asignadas a este diario</p>
            </div>
        );
    }

    return (
        <div className={styles.competenciasSection}>
            <h4>Competencias</h4>

            {Object.entries(competenciasPorArea).map(([area, competenciasArea]) => {
                const areaConfig = AREA_CONFIG[area as keyof typeof AREA_CONFIG];

                return (
                    <div key={area} className={styles.areaGroup}>
                        <h5 className={styles.areaTitulo}>
                            <span className={styles.areaIcono}>{areaConfig.icono}</span>
                            {areaConfig.nombre}
                        </h5>

                        <div className={styles.competenciasList}>
                            {competenciasArea.map((dc) => (
                                <button
                                    key={dc.id}
                                    onClick={() => handleCompetenciaClick(dc)}
                                    className={`${styles.competenciaCard} ${dc.estado === 'lograda' ? styles.competenciaLograda : ''}`}
                                    style={{ borderLeftColor: areaConfig.color }}
                                >
                                    <div className={styles.competenciaHeader}>
                                        <span className={styles.competenciaNombre}>
                                            {dc.competencia.nombre}
                                        </span>
                                        {dc.estado === 'lograda' ? (
                                            <CheckCircle className={styles.iconoLograda} size={20} />
                                        ) : dc.estado === 'en_desarrollo' ? (
                                            <span className={styles.estadoLabel}>En desarrollo</span>
                                        ) : (
                                            <Circle className={styles.iconoPendiente} size={20} />
                                        )}
                                    </div>
                                    {dc.estado === 'lograda' && dc.fecha_logro && (
                                        <span className={styles.fechaLogro}>
                                            Lograda: {new Date(dc.fecha_logro).toLocaleDateString('es-AR')}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}

            {selectedCompetencia && (
                <CompetenciaDetail
                    diarioCompetencia={selectedCompetencia}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
}
