import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orchardsPayments, bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Get all transactions from orchards_payments table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    // Query payments with booking details
    let query = db
      .select({
        id: orchardsPayments.id,
        transactionId: orchardsPayments.orchardsTransactionId,
        amount: orchardsPayments.amount,
        status: orchardsPayments.status,
        paymentType: orchardsPayments.paymentType,
        currency: orchardsPayments.currency,
        date: orchardsPayments.createdAt,
        paidAt: orchardsPayments.paidAt,
        // Booking details
        memberName: bookings.guestName,
        memberEmail: bookings.guestEmail,
        property: bookings.propertyName,
      })
      .from(orchardsPayments)
      .leftJoin(bookings, eq(orchardsPayments.bookingId, bookings.id))
      .orderBy(desc(orchardsPayments.createdAt));

    let results = await query;

    // Filter by status if provided
    if (statusParam && statusParam !== 'all') {
      results = results.filter(t => t.status?.toLowerCase() === statusParam.toLowerCase());
    }

    // Calculate commission (10% of amount)
    const transactions = results.map(t => ({
      id: t.id,
      transactionId: t.transactionId || `TXN-${t.id}`,
      memberName: t.memberName || 'Guest',
      memberEmail: t.memberEmail || 'N/A',
      amount: t.amount || 0,
      commission: (t.amount || 0) * 0.10, // 10% commission
      plan: t.paymentType || 'N/A',
      status: t.status || 'pending',
      date: t.date || new Date().toISOString(),
      property: t.property || 'N/A',
    }));

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
