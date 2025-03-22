'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProgresiones, getProgresionesForRama, getRama } from '@/lib/api';
import { Progresion, Rama } from '@/lib/supabase';

export default function ProgresionesPage() {
  const searchParams = useSearchParams();
  const ramaId = searchParams.get('rama_id') ? parseInt(searchParams.get('rama_id') as string) : null;
  
  const [progresiones, setProgresiones] = useState<Progresion[]>([]);
  const [ramaActual, setRamaActual] = useState<Rama | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        let data;
        if (ramaId) {
          // Cargar progresiones para una rama específica
          data = await getProgresionesForRama(ramaId);
          const ramaData = await getRama(ramaId);
          setRamaActual(ramaData);
        } else {
          // Cargar todas las progresiones
          data = await getProgresiones();
        }
        setProgresiones(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading progresiones:', err);
        setError('Error al cargar las progresiones. Por favor, verifica tu conexión a Supabase.');
        setLoading(false);
      }
    }

    loadData();
  }, [ramaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          <p className="mt-2">Cargando progresiones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold">Error</h3>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Asegúrate de haber configurado correctamente tus credenciales de Supabase en el archivo .env.local
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {ramaActual ? `Progresiones de ${ramaActual.rama}` : 'Todas las Progresiones'}
        </h1>
        {ramaActual && (
          <Link 
            href="/ramas" 
            className="text-green-600 hover:text-green-800"
          >
            Volver a Ramas
          </Link>
        )}
      </div>

      {progresiones.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-4">
          <p>
            {ramaActual 
              ? `No hay progresiones registradas para la rama ${ramaActual.rama}.` 
              : 'No hay progresiones registradas en la base de datos.'}
          </p>
          <p className="mt-2 text-sm">
            Para comenzar, debes configurar las progresiones en tu base de datos de Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progresiones.map((progresion) => (
            <div key={progresion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-amber-600 text-white p-4">
                <h2 className="text-xl font-semibold">{progresion.progresion}</h2>
                {!ramaActual && progresion.ramas && (
                  <p className="text-sm text-amber-100 mt-1">
                    Rama: {progresion.ramas.rama}
                  </p>
                )}
              </div>
              <div className="p-4">
                {progresion.descripcion && (
                  <p className="text-gray-600 mb-4">{progresion.descripcion}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/beneficiarios?progresion_id=${progresion.id}`}
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  >
                    Ver beneficiarios →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Información sobre las Progresiones</h2>
        <p className="text-gray-600 mb-4">
          Las progresiones son las etapas de desarrollo que siguen los beneficiarios dentro de cada rama.
          Cada progresión representa un conjunto de habilidades, conocimientos y actitudes que el beneficiario
          debe adquirir para avanzar en su camino scout.
        </p>
        <p className="text-gray-600">
          Para modificar las progresiones, debes hacerlo directamente en tu base de datos de Supabase.
        </p>
      </div>
    </div>
  );
}