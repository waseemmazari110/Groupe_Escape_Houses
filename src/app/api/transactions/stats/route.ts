import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Mock stats - implement actual payment transaction queries
    const stats = {
      totalRevenue: 0.0,
      successful: 0,
      pending: 0,
      failed: 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET transaction stats error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
