import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    console.log("Auth POST request:", url.pathname, url.search);
    
    const result = await handler.POST(request);
    console.log("Auth POST response status:", result.status);
    
    return result;
  } catch (error: any) {
    console.error("Auth API POST error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error?.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    console.log("Auth GET request:", url.pathname, url.search);
    
    const result = await handler.GET(request);
    console.log("Auth GET response status:", result.status);
    
    return result;
  } catch (error: any) {
    console.error("Auth API GET error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error?.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
