import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Mock stats - replace with actual database queries
    const stats = {
      totalMembers: 3,
      activeMembers: 0,
      totalRevenue: 0.0,
      newThisMonth: 2,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET membership stats error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
