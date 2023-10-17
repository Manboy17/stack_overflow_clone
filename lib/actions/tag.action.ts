"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopTagsByUserParams, getAllTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export async function getTopTagsByUser(params: GetTopTagsByUserParams) {
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

export async function getAllTags(params: getAllTagsParams) {
  try {
    await connectToDatabase();

    const tags = await Tag.find({});

    if (!tags) {
      throw new Error("Tags not found");
    }

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
