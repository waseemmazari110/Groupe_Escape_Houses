import { NextRequest, NextResponse } from "next/server";

// Mock data for memberships - replace with actual database queries
export async function GET(request: NextRequest) {
  try {
    // This is mock data - you'll need to implement actual database queries
    // based on your schema for membership/subscription tracking
    const members = [
      {
        id: 1,
        name: "test",
        email: "danharley2008@yahoo.co.uk",
        plan: "No Plan",
        status: "inactive",
        amount: "GBP 0.00",
        signupDate: "10/01/2026, 21:52",
        nextBilling: "-",
        payment: "Failed",
      },
    ];

    return NextResponse.json({
      members,
    });
  } catch (error) {
    console.error("GET memberships error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
