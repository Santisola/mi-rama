'use client';

import { signOut } from '@/lib/auth'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import styles from './UserButton.module.css';

export default function UserButton() {
    const { profile } = useUser();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    

    const handleLogout = async () => {
        setIsOverlayOpen(false);
        await signOut();
        redirect('/');
    }

    if(!profile) return null;
    
    return (
        <div className="relative">
            <button className={`${styles.userButton} flex gap-2
            items-center text-sm cursor-pointer`} onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
                {profile?.name || profile?.email?.split('@')[0]}
                <span>
                {profile?.name ?
                    profile.name.charAt(0).toUpperCase() :
                    profile?.email?.charAt(0).toUpperCase()}
                </span>
            </button>
            {isOverlayOpen && (
                <>
                <div className='fixed inset-0' onClick={() => setIsOverlayOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <button onClick={handleLogout} className="block w-full cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar Sesión</button>
                </div>
                </>
            )}
        </div>
    )
}
