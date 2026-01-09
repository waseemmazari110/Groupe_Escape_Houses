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
	baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
	trustedOrigins: [
		"https://www.groupescapehouses.co.uk",
		"https://groupescapehouses.co.uk",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://192.168.1.232:3000",
		"http://192.168.0.171:3000",
		"http://192.168.1.80:3000",
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
		password: {
			verify: async ({ password, hash }) => {
				console.log("[Auth Debug] Verifying password for hash:", hash.substring(0, 10) + "...");
				// 1. Check if the hash looks like the legacy MD5 format (32 hex characters)
				if (hash.length === 32 && /^[0-9a-f]+$/.test(hash)) {
					const md5Hash = crypto.createHash("md5").update(password).digest("hex");
					const match = md5Hash === hash;
					console.log("[Auth Debug] MD5 comparison:", match ? "Match" : "No match");
					return match;
				}

				// 2. Try standard scrypt verification WITH HMAC (if secret is present)
				const secret = process.env.BETTER_AUTH_SECRET;
				if (secret) {
					try {
						const passwordToVerify = await makeSignature(password, secret);
						const isValid = await verifyPassword({ password: passwordToVerify, hash });
						if (isValid) {
							console.log("[Auth Debug] Scrypt with HMAC: Match");
							return true;
						}
					} catch (e) {
						console.error("[Auth Debug] Scrypt with HMAC error:", e);
					}
				}

				// 3. Try standard scrypt verification WITHOUT HMAC
				try {
					const isValid = await verifyPassword({ password, hash });
					console.log("[Auth Debug] Scrypt without HMAC:", isValid ? "Match" : "No match");
					return isValid;
				} catch (e) {
					console.error("[Auth Debug] Scrypt without HMAC error:", e);
					return false;
				}
			}
		}
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
