// src/hooks/useUserProfile.ts
'use client';

import { useState, useEffect } from 'react';
import type { Database } from '@/types/supabase';
import { createBrowserSupabaseClientInstance } from '@/lib/supabase-browser';
import { getCurrentUser, getCurrentUserProfile } from '@/lib/auth';

interface UseUserProfileResult {
  user: Database['public']['Tables'] | null;
  profile: Database['public']['Tables']['educadores'] | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileResult {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClientInstance();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Obtener usuario autenticado
        const currentUser = await getCurrentUser(supabase);
        setUser(currentUser);

        if (!currentUser) {
          setProfile(null);
          return;
        }

        // Obtener perfil relacionado
        const currentProfile = await getCurrentUserProfile(supabase);
        setProfile(currentProfile);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  return { user, profile, loading, error };
}
