import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    
    if (existingUser.length === 0) {
      return NextResponse.json({ 
        found: false,
        message: "User not found in database"
      });
    }

    // Check if user has password in account table
    const userAccount = await db
      .select()
      .from(account)
      .where(eq(account.userId, existingUser[0].id))
      .limit(1);

    return NextResponse.json({ 
      found: true,
      user: {
        id: existingUser[0].id,
        email: existingUser[0].email,
        name: existingUser[0].name,
        role: existingUser[0].role,
        hasPassword: userAccount.length > 0 && userAccount[0].password ? "Yes (hashed)" : "No"
      }
    });
    
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ 
      error: "Failed to check user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
