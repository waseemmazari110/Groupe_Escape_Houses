import { db } from "./src/db";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
    try {
        // Check all users and their roles
        const allUsers = await db.select({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }).from(user);

        console.log("\n=== All Users ===");
        console.log(JSON.stringify(allUsers, null, 2));

        // Check for admin users specifically
        const adminUsers = allUsers.filter(u => u.role === "admin");
        
        console.log("\n=== Admin Users ===");
        if (adminUsers.length > 0) {
            console.log("✅ Found admin users:");
            adminUsers.forEach(admin => {
                console.log(`  - ${admin.email} (${admin.name})`);
            });
            console.log("\nYou can login at: http://localhost:3000/admin/login");
        } else {
            console.log("❌ No admin users found!");
            console.log("\nTo create an admin user:");
            console.log("1. Sign up at: http://localhost:3000/owner-login");
            console.log("2. Run: npx tsx make-admin.ts");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    process.exit(0);
}

checkAdmin();
