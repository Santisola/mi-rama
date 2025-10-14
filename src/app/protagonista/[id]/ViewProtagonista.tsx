'use client'
import { useState } from 'react';
import { getBeneficiario } from '@/lib/api';
import PumaLoader from '@/components/pumaLoader/PumaLoader';
import EditProtagonista from './editProtagonista/EditProtagonista';
import ProgresionesForm from './progresionesForm/ProgresionesForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ViewProtagonista({ id, initialData }: { id: string, initialData: any }) {
  const [beneficiario, setBeneficiario] = useState(initialData);
  const [isRefetching, setIsRefetching] = useState(false)

  const refetch = async () => {
    setIsRefetching(true)
    const data = await getBeneficiario(id);
    setBeneficiario(data);
    setIsRefetching(false);
  };

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
      </div>
    </article>
  );
}