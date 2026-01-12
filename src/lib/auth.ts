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
	const env = process.env.NODE_ENV;
	const vercelUrl = process.env.VERCEL_URL;
	
	console.log("[AUTH CONFIG] NODE_ENV:", env);
	console.log("[AUTH CONFIG] VERCEL_URL:", vercelUrl);
	console.log("[AUTH CONFIG] BETTER_AUTH_URL_PRODUCTION:", process.env.BETTER_AUTH_URL_PRODUCTION);
	
	if (env === "production") {
		const prodUrl = process.env.BETTER_AUTH_URL_PRODUCTION 
			|| (vercelUrl ? `https://${vercelUrl}` : null)
			|| process.env.NEXT_PUBLIC_APP_URL_PRODUCTION
			|| "https://groupe-escape-houses.vercel.app";
		console.log("[AUTH CONFIG] Using production URL:", prodUrl);
		return prodUrl;
	}
	
	const devUrl = process.env.BETTER_AUTH_URL 
		|| process.env.NEXT_PUBLIC_BETTER_AUTH_URL 
		|| "http://localhost:3000";
	console.log("[AUTH CONFIG] Using dev URL:", devUrl);
	return devUrl;
};

const baseURL = getBaseURL();
console.log("[AUTH CONFIG] Final baseURL:", baseURL);

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
	baseURL: baseURL,
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
					// Send welcome email asynchronously without blocking user creation
					sendWelcomeEmail(user.email, user.name).catch(err => {
						console.error("Failed to send welcome email:", err);
					});
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
