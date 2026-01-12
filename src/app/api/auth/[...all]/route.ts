import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

export async function POST(req: NextRequest) {
  try {
    console.log("[AUTH API] POST request to:", req.url);
    console.log("[AUTH API] Environment:", process.env.NODE_ENV);
    console.log("[AUTH API] Has BETTER_AUTH_SECRET:", !!process.env.BETTER_AUTH_SECRET);
    console.log("[AUTH API] Has TURSO_CONNECTION_URL:", !!process.env.TURSO_CONNECTION_URL);
    
    const result = await handler.POST(req);
    console.log("[AUTH API] Response status:", result.status);
    
    return result;
  } catch (error: any) {
    console.error("[AUTH API] POST Error:", error.message);
    console.error("[AUTH API] Stack:", error.stack);
    return NextResponse.json(
      { error: { message: error.message || "Authentication failed", stack: error.stack } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    return await handler.GET(req);
  } catch (error: any) {
    console.error("[AUTH API] GET Error:", error.message);
    return NextResponse.json(
      { error: { message: error.message || "Authentication failed" } },
      { status: 500 }
    );
  }
}
