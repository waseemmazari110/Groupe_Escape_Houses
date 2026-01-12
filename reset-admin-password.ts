import { db } from "./src/db/index";
import { user, account } from "./src/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

async function resetAdminPassword() {
  const email = "cswaseem110@gmail.com";
  const newPassword = "admin123"; // Change this to your desired password
  
  try {
    // Check if user exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    
    if (existingUser.length === 0) {
      console.log(`❌ User with email ${email} not found.`);
      console.log("Creating new admin user...");
      
      // Create new admin user
      const userId = crypto.randomUUID();
      const hashedPassword = await hashPassword(newPassword);
      
      await db.insert(user).values({
        id: userId,
        name: "Admin",
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
      
      console.log(`✅ Created new admin user: ${email}`);
      console.log(`Password: ${newPassword}`);
    } else {
      console.log(`Found user:`, existingUser[0]);
      
      // Update role to admin
      await db.update(user)
        .set({ role: "admin" })
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
        console.log(`✅ Updated password for ${email}`);
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
        console.log(`✅ Created account entry for ${email}`);
      }
      
      console.log(`✅ Successfully reset password for ${email}`);
    }
    
    console.log("\n=== Admin Login Credentials ===");
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log(`\nLogin at: http://localhost:3000/admin/login`);
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

resetAdminPassword();
