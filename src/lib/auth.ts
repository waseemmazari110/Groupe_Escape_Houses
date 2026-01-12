import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers";
import { db } from "@/db";
import * as schema from "@/db/schema";
import crypto from "crypto";
import { verifyPassword } from "better-auth/crypto";
import { sendWelcomeEmail } from "./email";

const makeSignature = (password: string, secret: string) => {
	const hmac = crypto.createHmac("sha256", secret);
	hmac.update(password);
	return hmac.digest("hex");
};

// Validate environment variables
if (!process.env.BETTER_AUTH_SECRET) {
	console.error("BETTER_AUTH_SECRET is not set!");
}

const getBaseURL = () => {
	if (process.env.NODE_ENV === "production") {
		return process.env.BETTER_AUTH_URL_PRODUCTION 
			|| (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
			|| process.env.NEXT_PUBLIC_APP_URL_PRODUCTION
			|| "https://groupe-escape-houses.vercel.app";
	}
	return process.env.BETTER_AUTH_URL 
		|| process.env.NEXT_PUBLIC_BETTER_AUTH_URL 
		|| "http://localhost:3000";
};

console.log("Auth baseURL:", getBaseURL());

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		}
	}),
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: getBaseURL(),
	trustedOrigins: [
		"https://www.groupescapehouses.co.uk",
		"https://groupescapehouses.co.uk",
		"https://groupe-escape-houses.vercel.app",
		"https://escape-houses-1-dan.vercel.app",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://192.168.1.232:3000",
		"http://192.168.0.171:3000",
		"http://192.168.1.80:3000",
		...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
		...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map(o => o.trim()) || [])
	],
	advanced: {
		trustHost: true,
		useSecureCookies: process.env.NODE_ENV === "production",
		cookieOptions: {
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		}
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await sendWelcomeEmail(user.email, user.name);
				}
			}
		}
	},
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "guest",
			},
			phoneNumber: {
				type: "string",
				required: false,
				map: "phone",
			},
			propertyName: {
				type: "string",
				required: false,
				map: "company_name",
			},
			propertyWebsite: {
				type: "string",
				required: false,
				map: "property_website",
			},
			planId: {
				type: "string",
				required: false,
				map: "plan_id",
			},
			paymentStatus: {
				type: "string",
				defaultValue: "pending",
				map: "payment_status",
			}
		}
	},
	plugins: [bearer()]
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	return session?.user || null;
}
