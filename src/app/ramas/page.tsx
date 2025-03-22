'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRamas } from '@/lib/api';
import { Rama } from '@/lib/supabase';

export default function RamasPage() {
  const [ramas, setRamas] = useState<Rama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRamas() {
      try {
        const data = await getRamas();
        setRamas(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ramas:', err);
        setError('Error al cargar las ramas. Por favor, verifica tu conexión a Supabase.');
        setLoading(false);
      }
    }

    loadRamas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-2">Cargando ramas...</p>
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
        <h1 className="text-2xl font-bold">Ramas</h1>
      </div>

      {ramas.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-4">
          <p>No hay ramas registradas en la base de datos.</p>
          <p className="mt-2 text-sm">
            Para comenzar, debes configurar las ramas en tu base de datos de Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ramas.map((rama) => (
            <div key={rama.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <h2 className="text-xl font-semibold">{rama.rama}</h2>
              </div>
              <div className="p-4">
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/progresiones?rama_id=${rama.id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Ver progresiones →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Información sobre las Ramas</h2>
        <p className="text-gray-600 mb-4">
          Las ramas son las diferentes secciones en las que se divide un grupo scout, generalmente por edades.
          Cada rama tiene sus propias progresiones y actividades adaptadas a las necesidades de desarrollo de los beneficiarios.
        </p>
        <p className="text-gray-600">
          Para modificar las ramas, debes hacerlo directamente en tu base de datos de Supabase.
        </p>
      </div>
    </div>
  );
}