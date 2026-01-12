'use client';

import { useState, useEffect } from 'react';
import {
    getDiarioActivoByBeneficiario,
    getCompetenciasByDiario,
    getProgresoByDiario,
} from '@/lib/api';
import type {
    DiarioMarchaConRelaciones,
    DiarioCompetenciaConRelaciones,
    ProgresoResumen,
} from '@/types/diario-marcha';
import { ETAPA_ICONOS } from '@/types/diario-marcha';
import CompetenciasList from './CompetenciasList';
import CierreEtapaModal from './CierreEtapaModal';
import ProgresoIndicador from './ProgresoIndicador';
import SelectorEtapa from './SelectorEtapa';
import SelectorCompetencias from './SelectorCompetencias';
import CrearDiarioForm from './CrearDiarioForm';
import styles from './diario-marcha.module.css';
import { PlusCircle } from 'lucide-react';

interface DiarioMarchaProps {
    beneficiarioId: number;
}

export default function DiarioMarcha({ beneficiarioId }: DiarioMarchaProps) {
    const [diario, setDiario] = useState<DiarioMarchaConRelaciones | null>(null);
    const [competencias, setCompetencias] = useState<DiarioCompetenciaConRelaciones[]>([]);
    const [progreso, setProgreso] = useState<ProgresoResumen | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCierreModal, setShowCierreModal] = useState(false);
    const [showCompetenciaSelector, setShowCompetenciaSelector] = useState(false);
    const [ramaId, setRamaId] = useState<number | null>(null);

    console.log(diario)

    const fetchDiarioData = async () => {
        try {
            setLoading(true);
            setError(null);

            const diarioData = await getDiarioActivoByBeneficiario(beneficiarioId);

            if (!diarioData) {
                setError('No hay un diario activo para este caminante');
                setLoading(false);
                return;
            }

            setDiario(diarioData);
            // Assuming the rama ID is available from the diario or beneficiario
            // Let's get it from the beneficiario since it's already in the prop-like context indirectly
            // Actually, let's just use the one from the diary relationships
            if (diarioData.etapa?.rama_id) {
                setRamaId(diarioData.etapa.rama_id);
            }

            const competenciasData = await getCompetenciasByDiario(diarioData.id);
            setCompetencias(competenciasData);

            const progresoData = await getProgresoByDiario(diarioData.id);
            setProgreso(progresoData);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching diario data:', err);
            setError('Error al cargar el diario de marcha');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiarioData();
    }, [beneficiarioId]);

    const handleRefresh = async () => {
        await fetchDiarioData();
    };

    const handleCierreEtapa = () => {
        setShowCierreModal(false);
        fetchDiarioData();
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando diario de marcha...</p>
            </div>
        );
    }

    if (error || !diario) {
        return (
            <section className={styles.container}>
                <CrearDiarioForm
                    beneficiarioId={beneficiarioId}
                    ramaId={3} // Caminantes
                    onSuccess={handleRefresh}
                />
            </section>
        );
    }

    const etapaIcono = ETAPA_ICONOS[diario.etapa.nombre.toLocaleLowerCase()] || '📖';
    const todasLogradas = competencias.length > 0 && competencias.every(c => c.estado === 'lograda');
    const estadoEtapa = todasLogradas ? 'Lista para cerrar etapa' : (competencias.length === 0 ? 'Sin competencias' : 'En curso');

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <div className={styles.etapaInfo}>
                    <span className={styles.etapaIcono}>{etapaIcono}</span>
                    <div>
                        <h3 className={styles.etapaNombre}>Etapa {diario.etapa.nombre}</h3>
                        <span className={`${styles.estadoBadge} ${todasLogradas ? styles.estadoListo : styles.estadoEnCurso}`}>
                            {estadoEtapa}
                        </span>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <button
                        onClick={() => setShowCompetenciaSelector(true)}
                        className={styles.btnAddCompetencia}
                        title="Asignar nuevas competencias"
                    >
                        <PlusCircle size={20} />
                        Asignar
                    </button>

                    {todasLogradas && (
                        <button
                            onClick={() => setShowCierreModal(true)}
                            className={styles.btnCerrarEtapa}
                        >
                            Pasar de Etapa
                        </button>
                    )}
                </div>
            </div>

            {showCompetenciaSelector && ramaId && (
                <SelectorCompetencias
                    diarioId={diario.id}
                    ramaId={ramaId}
                    onSelected={() => {
                        setShowCompetenciaSelector(false);
                        handleRefresh();
                    }}
                    onCancel={() => setShowCompetenciaSelector(false)}
                />
            )}

            <div className={styles.reflexionInicial}>
                <h4>Reflexión Inicial</h4>
                <p>{diario.reflexion_inicial}</p>
            </div>

            {progreso && progreso.total_competencias > 0 && (
                <div className={styles.progresoSection}>
                    <h4>Progreso de Etapa</h4>
                    <ProgresoIndicador
                        label="Total"
                        logradas={progreso.total_logradas}
                        total={progreso.total_competencias}
                        color="#0284d1"
                    />

                    <div className={styles.progresoAreas}>
                        {progreso.por_area.map((area) => (
                            <ProgresoIndicador
                                key={area.area}
                                area={area.area}
                                logradas={area.logradas}
                                total={area.total}
                            />
                        ))}
                    </div>
                </div>
            )}

            <CompetenciasList
                competencias={competencias}
                onRefresh={handleRefresh}
            />

            {showCierreModal && diario && ramaId && (
                <div className={styles.transitionOverlay}>
                    <div className={styles.transitionModal}>
                        <h3>Fin de Etapa {diario.etapa.nombre}</h3>
                        <p>Has completado todas las competencias seleccionadas. ¡Buen camino! Ahora elige la siguiente etapa para continuar tu Diario de Marcha.</p>
                        <SelectorEtapa
                            diarioId={diario.id}
                            ramaId={ramaId}
                            currentEtapaId={diario.etapa_id}
                            onSelected={handleCierreEtapa}
                        />
                        <button onClick={() => setShowCierreModal(false)} className={styles.btnCancelPlain}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
