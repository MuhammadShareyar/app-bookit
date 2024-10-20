"use server";

import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

async function createRoom(perviousState, formData) {
  const { databases, storage } = await createAdminClient();

  try {
    const { user } = await checkAuth();

    if (!user) {
      return {
        success: false,
        error: true,
        message: "You must be logged in to create a room!",
      };
    }

    // Uploading image
    const image = formData.get("image");
    let imageID;

    if (image && image.size > 0 && image.name !== "") {

      try {
        const response = await storage.createFile("rooms", ID.unique(), image);
        imageID = response.$id;
        
      } catch (error) {
          console.log('Error in uploading file');
          
      }
    }

    const newRoom = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      ID.unique(),
      {
        user_id: user.id,
        name: formData.get("name"),
        description: formData.get("description"),
        sqft: formData.get("sqft"),
        capacity: formData.get("capacity"),
        price_per_hour: formData.get("price_per_hour"),
        address: formData.get("address"),
        location: formData.get("location"),
        availability: formData.get("availability"),
        amenities: formData.get("amenities"),
        image: imageID,
      }
    );

    revalidatePath("/", "layout");

    return {
      success: true,
      error: false,
      message: "Room added successfuly!",
    };

    if (
      !name ||
      !description ||
      !sqft ||
      !price_per_hours ||
      !availability ||
      !address
    ) {
      return {
        success: false,
        error: true,
        message: "Please fill all fields!",
      };
    }
  } catch (error) {
    console.log("Error in adding room: ", error);

    return {
      success: false,
      error: true,
      message: "Adding room failed!",
    };
  }
}

export default createRoom;
