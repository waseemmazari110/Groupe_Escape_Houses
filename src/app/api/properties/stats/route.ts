import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get pending properties
    const pendingResult = await db
      .select({ count: count() })
      .from(properties)
      .where(eq(properties.status, "pending"));
    const pending = pendingResult[0]?.count || 0;

    // Get approved properties
    const approvedResult = await db
      .select({ count: count() })
      .from(properties)
      .where(eq(properties.status, "approved"));
    const approved = approvedResult[0]?.count || 0;

    // Get rejected properties
    const rejectedResult = await db
      .select({ count: count() })
      .from(properties)
      .where(eq(properties.status, "rejected"));
    const rejected = rejectedResult[0]?.count || 0;

    return NextResponse.json({
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    console.error("GET property stats error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
