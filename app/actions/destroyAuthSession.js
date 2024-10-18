"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function destroyAuthSession() {
  const sessionCookie = cookies().get("appwrite-session");

  if (!sessionCookie) {
    return {
      success: false,
      error: true,
      message: "No session cookie found!",
    };
  }

  try {
    // Get account instance
    const { account } = await createSessionClient(sessionCookie.value);

    //  Destroy session
    await account.deleteSession("current");

    // Clear session cookie
    cookies().delete("appwrite-session");

    return {
      success: true,
      error: false,
      message: "Logout successful!",
    };
  } catch (error) {

    return {
      success: false,
      error: true,
      message: "Error!",
    };
  }
}

export default destroyAuthSession;
