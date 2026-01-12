'use client'
import { useState } from 'react';
import { getBeneficiario, updateBeneficiarioLegajos } from '@/lib/api';
import PumaLoader from '@/components/pumaLoader/PumaLoader';
import EditProtagonista from './editProtagonista/EditProtagonista';
import ProgresionesForm from './progresionesForm/ProgresionesForm';
import LegajosTable from './legajosTable/LegajosTable';
import DiarioMarcha from './diarioMarcha/DiarioMarcha';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ViewProtagonista({ id, initialData, allLegajos }: { id: string, initialData: any, allLegajos: Legajo[] }) {
  const [beneficiario, setBeneficiario] = useState(initialData);
  const [isRefetching, setIsRefetching] = useState(false)

  const refetch = async () => {
    setIsRefetching(true)
    const data = await getBeneficiario(id);
    setBeneficiario(data);
    setIsRefetching(false);
  };

  const handleSaveLegajos = async (assignedLegajos: number[]) => {
    try {
      await updateBeneficiarioLegajos(id, assignedLegajos);
      await refetch();
    } catch (error) {
      console.error('Error al actualizar legajos:', error);
      throw error;
    }
  }

  if (!beneficiario || isRefetching) return <PumaLoader />;

  const { nombre, nacimiento, ...rest } = beneficiario;

  return (
    <article>
      <div className='container px-2 m-auto py-4'>
        <Link href={'/protagonistas'} className='block mb-4 text-sm flex items-center font-medium'><ChevronLeft /> Volver</Link>
        <strong className='text-white bg-primary px-3 py-1 rounded-4xl text-sm'>{rest.ramas?.nombre || '-'}</strong>
        <h2 className='text-4xl font-medium mt-2 mb-1'>{nombre}</h2>
        <p className='text-sm mb-2'>{nacimiento}</p>
        <EditProtagonista beneficiario={beneficiario} onEdit={refetch} />
        <p>Progresion actual: <strong>{rest.progresiones?.nombre || '-'}</strong></p>
        <ProgresionesForm protagonista={beneficiario} onEdit={refetch} />

        {rest.ramas?.id === 3 && <DiarioMarcha beneficiarioId={Number(id)} />}

        <LegajosTable protagonistaLegajos={beneficiario.legajos || []} allLegajos={allLegajos} onSave={handleSaveLegajos} />
      </div>
    </article>
  );
}