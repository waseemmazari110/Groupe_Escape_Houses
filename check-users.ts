
import { db } from "./src/db";
import { user } from "./src/db/schema";

async function main() {
    const users = await db.select({ email: user.email, password: user.password }).from(user).limit(10);
    console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error);
