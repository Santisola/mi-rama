import React from 'react'
import styles from './styles.module.css'

interface ModalProps {
    showModal: boolean,
    closeModal: () => void,
    children: React.ReactNode;
}

export default function Modal({showModal, closeModal, children}: ModalProps) {
  return showModal ? (
    <>
    <div onClick={() => closeModal} className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.15)] transition ${showModal ? 'max-h-dvh opacity-100' : 'max-h-0 opacity-0'}`}></div>
    <div className={`w-full max-w-[700px] fixed bg-white rounded-2xl p-4 z-50 ${styles.modal}`}>
        {children}
    </div>
    </>
  ) : <></>
}
