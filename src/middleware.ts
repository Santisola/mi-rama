import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { getCurrentUserProfile } from './lib/auth';

const isProtectedRoute = (req: Request) => {
  const url = new URL(req.url);
  return url.pathname.startsWith('/protagonistas');
}; 

export default async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Si la ruta es protegida y NO hay sesión, redirige
  if (isProtectedRoute(req) && !session) {
    const url = new URL('/sin-acceso', req.url);
    return NextResponse.redirect(url);
  }

  const profile = await getCurrentUserProfile(supabase);

  if (isProtectedRoute(req) && (!profile || profile.approved === false)) {
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
