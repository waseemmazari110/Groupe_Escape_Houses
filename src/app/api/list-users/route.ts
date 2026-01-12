import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, account } from "@/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    }).from(user);
    
    return NextResponse.json({ 
      count: allUsers.length,
      users: allUsers
    });
    
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json({ 
      error: "Failed to list users",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
