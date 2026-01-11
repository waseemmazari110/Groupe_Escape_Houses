import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, users } from "@/drizzle/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get total bookings
    const totalBookingsResult = await db.select({ count: count() }).from(bookings);
    const totalBookings = totalBookingsResult[0]?.count || 0;

    // Get total users
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get property owners (users with role = 'owner')
    const propertyOwnersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "owner"));
    const propertyOwners = propertyOwnersResult[0]?.count || 0;

    // Get guests (users with role = 'guest')
    const guestsResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "guest"));
    const guests = guestsResult[0]?.count || 0;

    return NextResponse.json({
      totalBookings,
      totalUsers,
      propertyOwners,
      guests,
    });
  } catch (error) {
    console.error("GET dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
