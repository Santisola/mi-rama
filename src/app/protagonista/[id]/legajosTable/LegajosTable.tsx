'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { BeneficiarioHasLegajos } from '@/lib/supabase';
import { BadgeCheck, BadgeAlert } from 'lucide-react';
import styles from './styles.module.css'

type Props = {
    protagonistaLegajos: BeneficiarioHasLegajos[]
    allLegajos: Legajo[]
    onSave?: (assignedLegajos: number[]) => Promise<void> | void
}

export default function LegajosTable({ protagonistaLegajos, allLegajos, onSave }: Props) {
    const [items, setItems] = useState(() =>
        allLegajos.map(l => ({ ...l, assigned: protagonistaLegajos.some(pl => pl.id_legajo === l.id) }))
    )
    const [isEditing, setIsEditing] = useState(false)
    const [originalItems, setOriginalItems] = useState(() =>
        allLegajos.map(l => ({ ...l, assigned: protagonistaLegajos.some(pl => pl.id_legajo === l.id) }))
    )
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const updated = allLegajos.map(l => ({ ...l, assigned: protagonistaLegajos.some(pl => pl.id_legajo === l.id) }))
        setItems(updated)
        setOriginalItems(updated)
    }, [protagonistaLegajos, allLegajos])

    const assignedCount = items.filter(i => i.assigned).length

    const toggleAssigned = (legajoId: number) => {
        if (!isEditing) return
        setItems(curr => curr.map(i => (i.id === legajoId ? { ...i, assigned: !i.assigned } : i)))
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setItems(originalItems)
        setIsEditing(false)
    }

    const handleSave = async () => {
        const assignedIds = items.filter(i => i.assigned).map(i => i.id)
        setIsSaving(true)
        try {
            if (onSave) await onSave(assignedIds)
            setOriginalItems(items)
            setIsEditing(false)
            console.log('Legajos actualizados:', assignedIds)
        } catch (err) {
            console.error('handleSave error', err)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <section className={`${styles.container} mt-6`} aria-labelledby="legajos-heading">
            <div className={styles.header}>
                <h3 id="legajos-heading" className={styles.title}>Legajos</h3>
                <div className={styles.summary}>
                    <span className={styles.count}>{assignedCount}</span>
                    <span className={styles.countLabel}>asignados / {items.length}</span>
                </div>
            </div>

            {!isEditing ? (
                <button
                    type="button"
                    className={styles.editBtn}
                    onClick={handleEdit}
                >
                    Editar
                </button>
            ) : (
                <div className={styles.actionButtons}>
                    <button
                        type="button"
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            <div className={styles.tableWrap} role="table" aria-label="Lista de legajos">
                <div role="rowgroup">
                    <div role="row" className={styles.rowHeader}>
                        <div role="columnheader" className={styles.colName}>Legajo</div>
                        <div role="columnheader" className={styles.colStatus}>Estado</div>
                    </div>
                </div>
                <div role="rowgroup">
                    {items.map(item => (
                        <div
                            role="row"
                            tabIndex={0}
                            key={item.id}
                            className={`${styles.row} ${item.assigned ? styles.assigned : ''}`}
                            aria-label={`Legajo ${item.legajo} ${item.assigned ? 'asignado' : 'no asignado'}`}>
                            <div role="cell" className={styles.colName}>{item.legajo}</div>
                            <div role="cell" className={styles.colStatus}>
                                {isEditing ? (
                                    <button
                                        type="button"
                                        className={styles.assignBtn}
                                        onClick={() => toggleAssigned(item.id)}
                                        aria-pressed={item.assigned}
                                        aria-label={item.assigned ? 'Desasignar legajo' : 'Asignar legajo'}
                                    >
                                        {item.assigned ? (
                                            <BadgeCheck className={styles.iconOk} />
                                        ) : (
                                            <BadgeAlert className={styles.iconAlert} />
                                        )}
                                    </button>
                                ) : (
                                    <span className={styles.badge}>
                                        {item.assigned ? (
                                            <BadgeCheck className={styles.iconOk} />
                                        ) : (
                                            <BadgeAlert className={styles.iconAlert} />
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className={styles.empty}>No hay legajos disponibles.</div>
                    )}
                </div>
            </div>
        </section>
    )
}
