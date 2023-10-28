"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetQuestionsByTagIdParams,
  GetTopTagsByUserParams,
  getAllTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

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

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, page, pageSize, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id id name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
