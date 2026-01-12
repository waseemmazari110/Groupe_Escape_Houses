import { db } from "@/db";
import { user, account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

export async function GET() {
  const email = "cswaseem110@gmail.com";
  const newPassword = "admin123";
  
  try {
    // Check if user exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    
    if (existingUser.length === 0) {
      console.log(`Creating new admin user...`);
      
      // Create new admin user
      const userId = crypto.randomUUID();
      const hashedPassword = await hashPassword(newPassword);
      
      await db.insert(user).values({
        id: userId,
        name: "Dan",
        email: email,
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Create account with password
      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: email,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return Response.json({ 
        success: true,
        message: `Created new admin user: ${email}`,
        email: email,
        password: newPassword
      });
    } else {
      console.log(`Found user, updating...`);
      
      // Update role to admin and name
      await db.update(user)
        .set({ role: "admin", name: "Dan" })
        .where(eq(user.email, email));
      
      // Update password in account table
      const hashedPassword = await hashPassword(newPassword);
      const userId = existingUser[0].id;
      
      // Check if account exists
      const existingAccount = await db.select().from(account)
        .where(eq(account.userId, userId))
        .limit(1);
      
      if (existingAccount.length > 0) {
        await db.update(account)
          .set({ password: hashedPassword, updatedAt: new Date() })
          .where(eq(account.userId, userId));
        
        return Response.json({ 
          success: true,
          message: `Updated password for ${email}`,
          email: email,
          password: newPassword
        });
      } else {
        // Create new account entry
        await db.insert(account).values({
          id: crypto.randomUUID(),
          accountId: email,
          providerId: "credential",
          userId: userId,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        return Response.json({ 
          success: true,
          message: `Created account entry for ${email}`,
          email: email,
          password: newPassword
        });
      }
    }
  } catch (error: any) {
    console.error("Error:", error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
