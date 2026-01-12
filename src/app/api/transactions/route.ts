import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";

// Get all transactions (using user payment data as proxy)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query;
    if (status && status !== 'all') {
      query = db
        .select({
          id: user.id,
          userName: user.name,
          email: user.email,
          plan: user.planId,
          amount: sql<number>`CASE 
            WHEN ${user.planId} = 'bronze' THEN 450
            WHEN ${user.planId} = 'silver' THEN 650
            WHEN ${user.planId} = 'gold' THEN 850
            ELSE 450
          END`,
          commission: sql<number>`CASE 
            WHEN ${user.planId} = 'bronze' THEN 45
            WHEN ${user.planId} = 'silver' THEN 65
            WHEN ${user.planId} = 'gold' THEN 85
            ELSE 45
          END`,
          status: user.paymentStatus,
          date: user.createdAt,
          property: user.propertyName,
        })
        .from(user)
        .where(sql`${user.role} = 'owner' AND ${user.paymentStatus} = ${status}`);
    } else {
      query = db
        .select({
          id: user.id,
          userName: user.name,
          email: user.email,
          plan: user.planId,
          amount: sql<number>`CASE 
            WHEN ${user.planId} = 'bronze' THEN 450
            WHEN ${user.planId} = 'silver' THEN 650
            WHEN ${user.planId} = 'gold' THEN 850
            ELSE 450
          END`,
          commission: sql<number>`CASE 
            WHEN ${user.planId} = 'bronze' THEN 45
            WHEN ${user.planId} = 'silver' THEN 65
            WHEN ${user.planId} = 'gold' THEN 85
            ELSE 45
          END`,
          status: user.paymentStatus,
          date: user.createdAt,
          property: user.propertyName,
        })
        .from(user)
        .where(sql`${user.role} = 'owner'`);
    }

    const transactions = await query;

    return NextResponse.json(
      {
        transactions,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("GET transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
