"use server";

import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";

async function createUser(previousState, formData) {
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  if (!email || !name || !password) {
    return {
      success: false,
      error: true,
      message: "Please fillout all fields",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: true,
      message: "Password must be alteast 8 characters",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: true,
      message: "Confirm password doesn't match the password",
    };
  }

  try {
    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    return {
      success: true,
      error: false,
      message: "User register successfuly!",
    };
  } catch (error) {
    console.log("User create failed: ", error);

    return {
      success: false,
      error: true,
      message: error.code === 409 ? "Email already exists!" : error.message,
    };
  }
}

export default createUser;
