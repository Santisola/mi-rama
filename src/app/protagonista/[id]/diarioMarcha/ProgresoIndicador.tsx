'use client';

import { AREA_CONFIG, type Area } from '@/types/diario-marcha';
import styles from './diario-marcha.module.css';

interface ProgresoIndicadorProps {
    label?: string;
    area?: Area;
    logradas: number;
    total: number;
    color?: string;
}

export default function ProgresoIndicador({
    label,
    area,
    logradas,
    total,
    color,
}: ProgresoIndicadorProps) {
    const areaConfig = area ? AREA_CONFIG[area] : null;
    const displayLabel = label || areaConfig?.nombre || '';
    const displayColor = color || areaConfig?.color || '#0284d1';
    const displayIcono = areaConfig?.icono || '';
    const porcentaje = total > 0 ? (logradas / total) * 100 : 0;

    return (
        <div className={styles.progresoIndicador}>
            <div className={styles.progresoHeader}>
                <span className={styles.progresoLabel}>
                    {displayIcono && <span className={styles.progresoIcono}>{displayIcono}</span>}
                    {displayLabel}
                </span>
                <span className={styles.progresoNumeros}>
                    {logradas}/{total}
                </span>
            </div>
            <div className={styles.progresoBar}>
                <div
                    className={styles.progresoFill}
                    style={{
                        width: `${porcentaje}%`,
                        backgroundColor: displayColor,
                    }}
                />
            </div>
        </div>
    );
}
