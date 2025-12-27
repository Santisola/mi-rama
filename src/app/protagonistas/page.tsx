import BeneficiariosTable from '@/components/beneficiariosTable/BeneficiariosTable';
import { getAllLegajos, getBeneficiarios } from '@/lib/api';
import { Beneficiario } from '@/lib/supabase';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentUserProfile } from '@/lib/auth';

export default async function Home() {
  const serverSupabase = createServerSupabaseClient();
  const profile = await getCurrentUserProfile(serverSupabase);

  const beneficiarios: Beneficiario[] = await getBeneficiarios();
  const allLegajos = await getAllLegajos();

  console.log('Beneficiarios fetched:', beneficiarios);

  return (
    <main className='container mx-auto px-2'>
      {(beneficiarios && profile?.id_rama && allLegajos) &&
      <BeneficiariosTable beneficiarios={beneficiarios} profile={profile} allLegajos={allLegajos} />
      }
    </main>
  );
}
