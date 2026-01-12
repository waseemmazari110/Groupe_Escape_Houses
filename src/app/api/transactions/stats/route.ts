import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { count, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get successful payments
    const successfulResult = await db
      .select({ count: count() })
      .from(user)
      .where(sql`${user.role} = 'owner' AND ${user.paymentStatus} IN ('paid', 'active')`);
    const successful = successfulResult[0]?.count || 0;

    // Get pending payments
    const pendingResult = await db
      .select({ count: count() })
      .from(user)
      .where(sql`${user.role} = 'owner' AND ${user.paymentStatus} = 'pending'`);
    const pending = pendingResult[0]?.count || 0;

    // Get failed payments
    const failedResult = await db
      .select({ count: count() })
      .from(user)
      .where(sql`${user.role} = 'owner' AND ${user.paymentStatus} = 'failed'`);
    const failed = failedResult[0]?.count || 0;

    // Calculate revenue with 10% commission
    const planPrices: Record<string, number> = {
      'bronze': 450,
      'silver': 650,
      'gold': 850,
      'basic': 450,
      'premium': 650,
      'professional': 850,
    };

    const revenueByPlan = await db
      .select({
        plan: user.planId,
        count: count()
      })
      .from(user)
      .where(sql`${user.role} = 'owner' AND ${user.paymentStatus} IN ('paid', 'active')`)
      .groupBy(user.planId);

    let totalRevenue = 0;
    let totalCommission = 0;
    revenueByPlan.forEach(item => {
      if (item.plan) {
        const price = planPrices[item.plan] || 450;
        const revenue = (item.count as number) * price;
        totalRevenue += revenue;
        totalCommission += revenue * 0.1; // 10% commission
      }
    });

    return NextResponse.json(
      {
        totalRevenue,
        totalCommission,
        netRevenue: totalRevenue - totalCommission,
        successful,
        pending,
        failed,
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
    console.error("GET transaction stats error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
