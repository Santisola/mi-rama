import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

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
      <html lang="es">
        <body
          className={`${montserrat.className} antialiased`}
        >
          <UserProvider>
            <Header />
            {children}
            <Footer />
          </UserProvider>
        </body>
      </html>
  );
}
