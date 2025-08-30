import { getCurrentUserProfile } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server';
import styles from './UserButton.module.css';

export default async function UserButton() {
    const supabase = createServerSupabaseClient();

    const profile = await getCurrentUserProfile(supabase);
    
    console.log('PROFILE', profile);
    if(!profile) return null;

    return (
        <button className={`${styles.userButton} flex`}>
            {profile?.name || profile?.email}
            <span>
            {profile?.name ?
                profile.name.charAt(0).toUpperCase() :
                profile?.email?.charAt(0).toUpperCase()}
            </span>
        </button>
    )
}
