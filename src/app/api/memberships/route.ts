import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, like, or, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planFilter = searchParams.get('plan');
    const paymentFilter = searchParams.get('payment');
    const search = searchParams.get('search');

    const conditions: any[] = [
      eq(user.role, "owner")
    ];

    if (planFilter && planFilter !== 'all') {
      conditions.push(eq(user.planId, planFilter));
    }

    if (paymentFilter && paymentFilter !== 'all') {
      conditions.push(eq(user.paymentStatus, paymentFilter));
    }

    if (search) {
      conditions.push(
        or(
          like(user.name, `%${search}%`),
          like(user.email, `%${search}%`),
          like(user.propertyName, `%${search}%`)
        )
      );
    }

    const memberships = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        propertyName: user.propertyName,
        planId: user.planId,
        paymentStatus: user.paymentStatus,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(and(...conditions));

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error("GET memberships error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
