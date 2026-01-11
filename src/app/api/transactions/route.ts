import { NextRequest, NextResponse } from "next/server";

// Mock data for transactions - replace with actual Stripe/payment integration
export async function GET(request: NextRequest) {
  try {
    // This is mock data - implement actual payment transaction queries
    const transactions: any[] = [];

    return NextResponse.json({
      transactions,
    });
  } catch (error) {
    console.error("GET transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
