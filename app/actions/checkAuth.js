"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function checkAuth() {
  const sessionCookie = cookies().get("appwrite-session");

  if (!sessionCookie) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    // Get account instance
    const { account } = await createSessionClient(sessionCookie.value);

    //  Destroy session
    const user = await account.get();

    return {
      isAuthenticated: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    return {
      isAuthenticated: true,
      success: false,
      error: true,
      message: "Error!",
    };
  }
}

export default checkAuth;
