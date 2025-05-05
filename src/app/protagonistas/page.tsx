import BeneficiariosTable from '@/components/beneficiariosTable/BeneficiariosTable';
import { getBeneficiarios } from '@/lib/api';
import { Beneficiario } from '@/lib/supabase';

export default async function Home() {
  const beneficiarios:Beneficiario[] = await getBeneficiarios();
  
  console.log('BENEFICIARIOS?', beneficiarios);
  
  return (
    <main className='container mx-auto px-2'>
      {beneficiarios &&
      <BeneficiariosTable beneficiarios={beneficiarios} />
      }
    </main>
  );
}
