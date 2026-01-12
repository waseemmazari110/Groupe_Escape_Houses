import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

export async function POST(request: NextRequest) {
  try {
    return await handler.POST(request);
  } catch (error: any) {
    console.error("Auth API POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    return await handler.GET(request);
  } catch (error: any) {
    console.error("Auth API GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
