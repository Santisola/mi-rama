import { getCurrentUserProfile } from '@/lib/auth'
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function UserButton() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    console.log('USER', user);

    const profile = user ? await getCurrentUserProfile(supabase, user.id) : null;
    
    console.log('PROFILE', profile);
    return (
        <div>{profile?.name || user?.email}</div>
    )
}
