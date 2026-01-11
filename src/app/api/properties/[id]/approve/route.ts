import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
    }

    // Update property status to approved
    await db
      .update(properties)
      .set({
        status: "approved",
        approvedAt: new Date().toISOString(),
        isPublished: 1,
      })
      .where(eq(properties.id, propertyId));

    return NextResponse.json({ success: true, message: "Property approved successfully" });
  } catch (error) {
    console.error("POST approve property error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
