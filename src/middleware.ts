import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

const isProtectedRoute = (req: Request) => {
  const url = new URL(req.url);
  return /^\/protagonista(\/.*)?$/.test(url.pathname);
};

export default async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('SESION', session);
  
  // Si la ruta es protegida y el usuario no es admin, redirige
  if (
    isProtectedRoute(req) && false
  ) {
    const url = new URL('/sin-acceso', req.url);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
