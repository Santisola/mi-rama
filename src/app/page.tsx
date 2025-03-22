import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Bienvenido al Sistema de Gestión Scout</h2>
        <p className="text-gray-600 mb-4">
          Esta plataforma te permite gestionar los beneficiarios de tu grupo scout, 
          asignarles progresiones y hacer un seguimiento de su desarrollo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link 
            href="/beneficiarios"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Beneficiarios</h3>
            <p>Gestiona la información de los miembros de tu grupo scout</p>
          </Link>
          <Link 
            href="/ramas"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Ramas</h3>
            <p>Administra las diferentes ramas de tu grupo scout</p>
          </Link>
          <Link 
            href="/progresiones"
            className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Progresiones</h3>
            <p>Configura y asigna progresiones a los beneficiarios</p>
          </Link>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Instrucciones de Uso</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">1. Configuración</h3>
            <p className="text-gray-600">
              Para comenzar a utilizar el sistema, debes configurar tus credenciales de Supabase 
              en el archivo .env.local con tus propias claves de API.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">2. Gestión de Beneficiarios</h3>
            <p className="text-gray-600">
              Agrega, edita y elimina beneficiarios. Asigna a cada uno su rama correspondiente 
              y realiza un seguimiento de su progresión.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">3. Seguimiento de Progresiones</h3>
            <p className="text-gray-600">
              Visualiza y actualiza el progreso de cada beneficiario dentro de su rama, 
              facilitando el seguimiento de su desarrollo personal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
