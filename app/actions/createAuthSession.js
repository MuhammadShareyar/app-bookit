"use server";

import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function createAuthSession(previousState, formdata) {
  const email = formdata.get("email");
  const password = formdata.get("password");

  if (!email || !password) {
    return {
      success: false,
      error: true,
      message: "Please fill all fields",
    };
  }

  // Get account instance
  const { account } = await createAdminClient();

  try {
    //  Generate session
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
    });

    return {
      success: true,
      error: false,
      message: "Login successful!",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "Invalid credentials!",
    };
  }
}

export default createAuthSession;
