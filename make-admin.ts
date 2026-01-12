import { db } from "./src/db/index";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function makeUserAdmin() {
  const email = "cswaseem110@gmail.com";
  
  try {
    // Check if user exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    
    if (existingUser.length === 0) {
      console.log(`❌ User with email ${email} not found.`);
      console.log("Please sign up first at: http://localhost:3000/owner-login");
      process.exit(1);
    }
    
    console.log(`Found user:`, existingUser[0]);
    
    // Update user role to admin
    await db.update(user)
      .set({ role: "admin" })
      .where(eq(user.email, email));
    
    console.log(`✅ Successfully updated ${email} to admin role!`);
    console.log("You can now login at: http://localhost:3000/admin/login");
    
  } catch (error) {
    console.error("❌ Error updating user:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

makeUserAdmin();
