import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  // Use relative URL for browser to avoid "Invalid origin" on cross-subdomain requests
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NODE_ENV === "production" 
      ? (process.env.BETTER_AUTH_URL_PRODUCTION 
         || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
         || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION
         || 'https://groupe-escape-houses.vercel.app')
      : (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000')),
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
});

export const { useSession, signIn, signUp, signOut } = authClient;
