import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";
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

    // Update property to unpublish it
    await db
      .update(properties)
      .set({
        isPublished: 0,
      })
      .where(eq(properties.id, propertyId));

    return NextResponse.json({ success: true, message: "Property unpublished" });
  } catch (error) {
    console.error("POST unpublish property error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
