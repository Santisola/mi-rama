import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Rama - Sistema de Gestión Scout",
  description: "Sistema para gestionar beneficiarios de un grupo scout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-700 text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mi Rama</h1>
                <nav>
                  <ul className="flex space-x-4">
                    <li>
                      <Link href="/" className="hover:underline">Inicio</Link>
                    </li>
                    <li>
                      <Link href="/beneficiarios" className="hover:underline">Beneficiarios</Link>
                    </li>
                    <li>
                      <Link href="/ramas" className="hover:underline">Ramas</Link>
                    </li>
                    <li>
                      <Link href="/progresiones" className="hover:underline">Progresiones</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-200 py-4">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>© {new Date().getFullYear()} Mi Rama - Sistema de Gestión Scout</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
