import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orchardsPayments } from "@/db/schema";
import { count, sum, eq, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get all payments
    const allPayments = await db
      .select({
        amount: orchardsPayments.amount,
        status: orchardsPayments.status,
      })
      .from(orchardsPayments);

    // Calculate totals and counts
    let totalRevenue = 0;
    let successful = 0;
    let pending = 0;
    let failed = 0;

    allPayments.forEach(payment => {
      const status = (payment.status || '').toLowerCase();
      const amount = payment.amount || 0;

      if (status === 'succeeded' || status === 'paid' || status === 'completed') {
        totalRevenue += amount;
        successful++;
      } else if (status === 'pending' || status === 'processing') {
        pending++;
      } else if (status === 'failed' || status === 'cancelled' || status === 'refunded') {
        failed++;
      }
    });

    // Calculate 10% commission
    const totalCommission = totalRevenue * 0.10;
    const netRevenue = totalRevenue - totalCommission;

    return NextResponse.json(
      {
        totalRevenue,
        totalCommission,
        netRevenue,
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
    );
  }
}
