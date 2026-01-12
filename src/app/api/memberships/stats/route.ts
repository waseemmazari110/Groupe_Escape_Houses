import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Total memberships (owners)
    const totalResult = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.role, "owner"));
    const total = totalResult[0]?.count || 0;

    // Active memberships (paid status)
    const activeResult = await db
      .select({ count: count() })
      .from(user)
      .where(sql`${user.role} = 'owner' AND ${user.paymentStatus} IN ('paid', 'active')`);
    const active = activeResult[0]?.count || 0;

    // Get by plan type
    const byPlan = await db
      .select({
        plan: user.planId,
        count: count()
      })
      .from(user)
      .where(eq(user.role, "owner"))
      .groupBy(user.planId);

    // Calculate revenue (basic estimate)
    const planPrices: Record<string, number> = {
      'basic': 49,
      'premium': 99,
      'professional': 199,
    };

    let totalRevenue = 0;
    byPlan.forEach(item => {
      if (item.plan) {
        const price = planPrices[item.plan] || 99;
        totalRevenue += (item.count as number) * price;
      }
    });

    return NextResponse.json({
      totalMembers: total,
      activeMembers: active,
      totalRevenue,
      newThisMonth: total, // This would need date filtering
    });
  } catch (error) {
    console.error("GET membership stats error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
