'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBeneficiario } from '@/lib/api';
import { getRamas, getProgresionesForRama } from '@/lib/api';
import { Rama, Progresion } from '@/lib/supabase';

export default function NuevoBeneficiarioPage() {
  const router = useRouter();
  const [ramas, setRamas] = useState<Rama[]>([]);
  const [progresiones, setProgresiones] = useState<Progresion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nacimiento: '',
    genero: '',
    id_rama: 0,
    id_progresion: null as number | null
  });

  useEffect(() => {
    async function loadRamas() {
      try {
        const data = await getRamas();
        setRamas(data);
      } catch (err) {
        console.error('Error loading ramas:', err);
        setError('Error al cargar las ramas. Por favor, verifica tu conexión a Supabase.');
      }
    }

    loadRamas();
  }, []);

  useEffect(() => {
    async function loadProgresiones() {
      if (formData.id_rama) {
        try {
          const data = await getProgresionesForRama(formData.id_rama);
          setProgresiones(data);
        } catch (err) {
          console.error('Error loading progresiones:', err);
          setError('Error al cargar las progresiones. Por favor, verifica tu conexión a Supabase.');
        }
      } else {
        setProgresiones([]);
      }
    }

    loadProgresiones();
  }, [formData.id_rama]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'id_rama') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
        id_progresion: null // Reset progresion when rama changes
      });
    } else if (name === 'id_progresion') {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value) : null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBeneficiario(formData);
      router.push('/beneficiarios');
    } catch (err) {
      console.error('Error creating beneficiario:', err);
      setError('Error al crear el beneficiario. Por favor, verifica tu conexión a Supabase.');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nuevo Beneficiario</h1>
        <Link 
          href="/beneficiarios" 
          className="text-blue-600 hover:text-blue-800"
        >
          Volver al listado
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="nacimiento"
                name="nacimiento"
                value={formData.nacimiento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="id_rama" className="block text-sm font-medium text-gray-700 mb-1">
                Rama *
              </label>
              <select
                id="id_rama"
                name="id_rama"
                value={formData.id_rama || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una rama</option>
                {ramas.map((rama) => (
                  <option key={rama.id} value={rama.id}>
                    {rama.rama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="id_progresion" className="block text-sm font-medium text-gray-700 mb-1">
                Progresión
              </label>
              <select
                id="id_progresion"
                name="id_progresion"
                value={formData.id_progresion || ''}
                onChange={handleChange}
                disabled={!formData.id_rama || progresiones.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Selecciona una progresión</option>
                {progresiones.map((progresion) => (
                  <option key={progresion.id} value={progresion.id}>
                    {progresion.progresion}
                  </option>
                ))}
              </select>
              {(formData.id_rama && progresiones.length === 0) ? (
                <p className="text-sm text-yellow-600 mt-1">
                  No hay progresiones disponibles para esta rama.
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/beneficiarios"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}