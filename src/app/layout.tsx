import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Mi Rama - Gestion scout",
  description: "Realizá el seguimiento de la progresión personal y el desarrollo de protagonistas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${montserrat.className} antialiased`}
        >
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
