import BeneficiariosTable from '@/components/beneficiariosTable/BeneficiariosTable';
import { getBeneficiarios } from '@/lib/api';
import { Beneficiario } from '@/lib/supabase';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentUserProfile } from '@/lib/auth';

export default async function Home() {
  const serverSupabase = createServerSupabaseClient();
  const profile = await getCurrentUserProfile(serverSupabase);

  console.log('User profile in protagonistas page:', profile);

  const beneficiarios: Beneficiario[] = await getBeneficiarios();

  return (
    <main className='container mx-auto px-2'>
      {(beneficiarios && profile?.id_rama) &&
      <BeneficiariosTable beneficiarios={beneficiarios} profile={profile} />
      }
    </main>
  );
}
