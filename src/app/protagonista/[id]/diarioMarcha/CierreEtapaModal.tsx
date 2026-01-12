'use client';

import { useState } from 'react';
import { cerrarEtapa } from '@/lib/api';
import type { CierreEtapaFormInput } from '@/types/diario-marcha';
import Modal from '@/components/ui/Modal/Modal';
import { X } from 'lucide-react';
import styles from './diario-marcha.module.css';

interface CierreEtapaModalProps {
    diarioId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CierreEtapaModal({
    diarioId,
    onClose,
    onSuccess,
}: CierreEtapaModalProps) {
    const [formData, setFormData] = useState<CierreEtapaFormInput>({
        reflexion_final: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.reflexion_final.trim()) {
            setError('La reflexión final es obligatoria');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await cerrarEtapa(diarioId, formData.reflexion_final);
            onSuccess();
        } catch (err) {
            console.error('Error closing etapa:', err);
            setError('Error al cerrar la etapa');
            setSubmitting(false);
        }
    };

    return (
        <Modal showModal={true} closeModal={onClose}>
            <div className={styles.cierreModal}>
                <div className={styles.detailHeader}>
                    <h3 className={styles.detailTitulo}>Cerrar Etapa</h3>
                    <button onClick={onClose} className={styles.btnClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.cierreInfo}>
                    <p>
                        Estás a punto de cerrar esta etapa del Diario de Marcha.
                        Por favor, escribe una reflexión final sobre el recorrido del caminante.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.formError}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label htmlFor="reflexion_final" className={styles.formLabel}>
                            Reflexión Final
                        </label>
                        <textarea
                            id="reflexion_final"
                            value={formData.reflexion_final}
                            onChange={(e) => setFormData({ reflexion_final: e.target.value })}
                            className={styles.formTextarea}
                            rows={6}
                            placeholder="Reflexiona sobre el crecimiento, aprendizajes y logros del caminante en esta etapa..."
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.cierreActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.btnCancel}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={styles.btnSubmit}
                        >
                            {submitting ? 'Cerrando...' : 'Cerrar Etapa'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
