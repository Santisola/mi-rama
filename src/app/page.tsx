import BeneficiariosTable from '@/components/beneficiariosTable/BeneficiariosTable';
import NewBeneficiario from '@/components/newBeneficiario/NewBeneficiario';
import { getBeneficiarios } from '@/lib/api';
import { Beneficiario } from '@/lib/supabase';

export default async function Home() {
  const beneficiarios:Beneficiario[] = await getBeneficiarios();

  console.log('BENEFICIARIOS?', beneficiarios);
  
  return (
    <main className='container mx-auto px-2'>
      <div className='flex justify-between items-center my-4'>
        <h2 className='my-4 text-2xl'>Mi Rama wachi</h2>
        <NewBeneficiario />
      </div>
      {beneficiarios &&
      <BeneficiariosTable beneficiarios={beneficiarios} />
      }
    </main>
  );
}
