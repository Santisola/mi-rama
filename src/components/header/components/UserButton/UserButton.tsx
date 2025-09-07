'use client';

import { getCurrentUserProfile, signOut } from '@/lib/auth'
import { createBrowserSupabaseClientInstance } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';
import styles from './UserButton.module.css';
import { redirect } from 'next/navigation';

export default function UserButton() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    
    useEffect(() => {
        const getProfile = async () => {
            const supabase = createBrowserSupabaseClientInstance();
        
            const profile = await getCurrentUserProfile(supabase);
            setProfile(profile);
        }
    
        getProfile()
    }, []);

    const handleLogout = async () => {
        await signOut();
        setProfile(null);
        redirect('/');
    }
    console.log('PROFILE', profile);
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
