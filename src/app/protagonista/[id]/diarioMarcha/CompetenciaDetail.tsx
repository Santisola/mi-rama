'use client';

import { useState, useEffect } from 'react';
import type {
    DiarioCompetenciaConRelaciones,
    Accion,
    ObservacionEducador,
} from '@/types/diario-marcha';
import {
    getAccionesByDiarioCompetencia,
    getObservacionesByDiarioCompetencia,
    marcarCompetenciaLograda,
} from '@/lib/api';
import { AREA_CONFIG } from '@/types/diario-marcha';
import Modal from '@/components/ui/Modal/Modal';
import AccionForm from './AccionForm';
import ObservacionForm from './ObservacionForm';
import { CheckCircle, X } from 'lucide-react';
import styles from './diario-marcha.module.css';

interface CompetenciaDetailProps {
    diarioCompetencia: DiarioCompetenciaConRelaciones;
    onClose: () => void;
}

export default function CompetenciaDetail({
    diarioCompetencia,
    onClose,
}: CompetenciaDetailProps) {
    const [acciones, setAcciones] = useState<Accion[]>([]);
    const [observaciones, setObservaciones] = useState<ObservacionEducador[]>([]);
    const [loading, setLoading] = useState(true);
    const [marcandoLograda, setMarcandoLograda] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [accionesData, observacionesData] = await Promise.all([
                getAccionesByDiarioCompetencia(diarioCompetencia.id),
                getObservacionesByDiarioCompetencia(diarioCompetencia.id),
            ]);
            setAcciones(accionesData);
            setObservaciones(observacionesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching competencia details:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [diarioCompetencia.id]);

    const handleMarcarLograda = async () => {
        try {
            setMarcandoLograda(true);
            await marcarCompetenciaLograda(diarioCompetencia.id);
            onClose(); // Refresh parent
        } catch (error) {
            console.error('Error marking competencia as lograda:', error);
            alert('Error al marcar la competencia como lograda');
            setMarcandoLograda(false);
        }
    };

    const handleAccionCreated = () => {
        fetchData();
    };

    const handleObservacionCreated = () => {
        fetchData();
    };

    const areaConfig = AREA_CONFIG[diarioCompetencia.competencia.area];

    return (
        <Modal showModal={true} closeModal={onClose}>
            <div className={styles.detailContainer}>
                <div className={styles.detailHeader}>
                    <div>
                        <div className={styles.detailArea} style={{ color: areaConfig.color }}>
                            {areaConfig.icono} {areaConfig.nombre}
                        </div>
                        <h3 className={styles.detailTitulo}>{diarioCompetencia.competencia.nombre}</h3>
                    </div>
                    <button onClick={onClose} className={styles.btnClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.detailDescripcion}>
                    <h4>Descripción</h4>
                    <p>{diarioCompetencia.competencia.descripcion}</p>
                </div>

                {diarioCompetencia.estado !== 'lograda' && (
                    <button
                        onClick={handleMarcarLograda}
                        disabled={marcandoLograda}
                        className={styles.btnMarcarLograda}
                    >
                        <CheckCircle size={20} />
                        {marcandoLograda ? 'Marcando...' : 'Marcar como Lograda'}
                    </button>
                )}

                {diarioCompetencia.estado === 'lograda' && (
                    <div className={styles.competenciaLogradaBadge}>
                        <CheckCircle size={20} />
                        Competencia Lograda
                        {diarioCompetencia.fecha_logro && (
                            <span className={styles.fechaLogroSmall}>
                                {new Date(diarioCompetencia.fecha_logro).toLocaleDateString('es-AR')}
                            </span>
                        )}
                    </div>
                )}

                <div className={styles.detailSection}>
                    <h4>Acciones</h4>
                    {loading ? (
                        <p className={styles.loadingText}>Cargando...</p>
                    ) : acciones.length === 0 ? (
                        <p className={styles.emptyText}>No hay acciones registradas</p>
                    ) : (
                        <div className={styles.itemsList}>
                            {acciones.map((accion) => (
                                <div key={accion.id} className={styles.accionItem}>
                                    <div className={styles.itemFecha}>
                                        {new Date(accion.fecha).toLocaleDateString('es-AR')}
                                    </div>
                                    <div className={styles.itemDescripcion}>
                                        <strong>Descripción:</strong> {accion.descripcion}
                                    </div>
                                    <div className={styles.itemReflexion}>
                                        <strong>Reflexión:</strong> {accion.reflexion}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <AccionForm
                        diarioCompetenciaId={diarioCompetencia.id}
                        onSuccess={handleAccionCreated}
                    />
                </div>

                <div className={styles.detailSection}>
                    <h4>Observaciones del Educador</h4>
                    {loading ? (
                        <p className={styles.loadingText}>Cargando...</p>
                    ) : observaciones.length === 0 ? (
                        <p className={styles.emptyText}>No hay observaciones registradas</p>
                    ) : (
                        <div className={styles.itemsList}>
                            {observaciones.map((obs) => (
                                <div key={obs.id} className={styles.observacionItem}>
                                    <div className={styles.itemFecha}>
                                        {new Date(obs.fecha).toLocaleDateString('es-AR')}
                                    </div>
                                    <div className={styles.itemObservacion}>
                                        {obs.comentario}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <ObservacionForm
                        diarioCompetenciaId={diarioCompetencia.id}
                        onSuccess={handleObservacionCreated}
                    />
                </div>
            </div>
        </Modal>
    );
}
