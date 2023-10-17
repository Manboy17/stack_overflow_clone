"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopTagsByUser } from "./shared.types";

export async function getTopTagsByUser(params: GetTopTagsByUser) {
  try {
    await connectToDatabase();

    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
