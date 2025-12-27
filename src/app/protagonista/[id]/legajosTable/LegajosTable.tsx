'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { BeneficiarioHasLegajos } from '@/lib/supabase';
import { BadgeCheck, BadgeAlert } from 'lucide-react';
import styles from './styles.module.css'

type Props = {
    protagonistaLegajos: BeneficiarioHasLegajos[]
    allLegajos: Legajo[]
    onToggle?: (id_legajo: number, assign: boolean) => Promise<void> | void
}

export default function LegajosTable({ protagonistaLegajos, allLegajos, onToggle }: Props) {
    const [items, setItems] = useState(() =>
        allLegajos.map(l => ({ ...l, assigned: protagonistaLegajos.some(pl => pl.id_legajo === l.id) }))
    )

    useEffect(() => {
        setItems(allLegajos.map(l => ({ ...l, assigned: protagonistaLegajos.some(pl => pl.id_legajo === l.id) })))
    }, [protagonistaLegajos, allLegajos])

    const assignedCount = items.filter(i => i.assigned).length

    const toggleAssigned = async (legajoId: number) => {
        const prev = items.find(i => i.id === legajoId)
        if (!prev) return
        const newAssigned = !prev.assigned
        setItems(curr => curr.map(i => (i.id === legajoId ? { ...i, assigned: newAssigned, updating: true } : i)))
        try {
            if (onToggle) await onToggle(legajoId, newAssigned)
            setItems(curr => curr.map(i => (i.id === legajoId ? { ...i, updating: false } : i)))
        } catch (err) {
            console.error('toggleAssigned error', err)
            setItems(curr => curr.map(i => (i.id === legajoId ? { ...i, assigned: prev.assigned, updating: false } : i)))
        }
    }

    return (
        <section className={styles.container} aria-labelledby="legajos-heading">
            <div className={styles.header}>
                <h3 id="legajos-heading" className={styles.title}>Legajos</h3>
                <div className={styles.summary}>
                    <span className={styles.count}>{assignedCount}</span>
                    <span className={styles.countLabel}>asignados / {items.length}</span>
                </div>
            </div>

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
