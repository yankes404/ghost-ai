import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  `${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}(.*)`,
  `${process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}(.*)`,
])

export const proxy = clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname === '/') {
    const { userId } = await auth()
    const dest = userId ? '/editor' : '/sign-in'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
