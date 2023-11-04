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

    const { userId } = params;

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

    const { searchQuery, filter, page = 1, pageSize = 30 } = params;

    const query: FilterQuery<typeof Tag> = searchQuery
      ? { name: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const skipAmount = (page - 1) * pageSize;

    const totalTags = await Tag.countDocuments(query);
    console.log(totalTags);

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalTags > skipAmount + tags.length;

    if (!tags) {
      throw new Error("Tags not found");
    }

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, page = 1, pageSize = 20, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { explanation: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const skipAmount = (page - 1) * pageSize;

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // +1 means we will check if there is next page
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id id name picture" },
      ],
    });

    const isNext = tag.questions.length > pageSize;

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopTags() {
  try {
    await connectToDatabase();

    const tags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numberOfQuestions: { $size: "$questions" },
        },
      },
      {
        $sort: { numberOfQuestions: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
