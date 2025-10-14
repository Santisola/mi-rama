'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { AuthError, Session, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabaseClientInstance } from "@/lib/supabase-browser";
import { getCurrentUserProfile } from "@/lib/auth";

interface UserContextType {
    session: Session | null
    sessionError: AuthError | null,
    profile: Profile | null
}

const UserContext = createContext<UserContextType>({
    session: null,
    sessionError: null,
    profile: null
});

export const UserProvider = ({ children }: {children: ReactNode}) => {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [sessionError, setSessionError] = useState<AuthError | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const supabaseInstance = createBrowserSupabaseClientInstance();
            setSupabase(supabaseInstance);
            
            const {
                data: { session },
                error
            } = await supabaseInstance.auth.getSession();

            if(error) {
                setSessionError(error);
                console.error('Error getting session:', error);
                return;
            }

            setSession(session);

            // Escucha cambios de sesión
            const { data: listener } = supabaseInstance.auth.onAuthStateChange((_event, session) => {
                setSession(session ?? null);
            });

            return () => {
                listener.subscription.unsubscribe();
            };
        }

        getSession();
    }, []);


    useEffect(() => {
        const getProfile = async () => {
            if(supabase) {
                const profile = await getCurrentUserProfile(supabase);
                setProfile(profile);
            }        
        }
    
        getProfile()
    }, [ session ]);

    return (
        <UserContext.Provider value={{
            session,
            sessionError,
            profile
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}
