
import { autumnHandler } from "autumn-js/next";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const handler = autumnHandler({
  identify: async (request) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      
      if (!session?.user) {
        console.log("Autumn: No session found");
        return null;
      }
      
      console.log("Autumn: User identified:", session.user.id, session.user.email);
      
      return {
        customerId: session.user.id,
        customerData: {
          name: session.user.name,
          email: session.user.email,
        },
      };
    } catch (error) {
      console.error("Autumn identify error:", error);
      return null;
    }
  },
});

export const { GET, POST } = handler;
