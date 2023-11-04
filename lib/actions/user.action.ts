"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserAnswersParams,
  GetUserByIdParams,
  GetUserInfoParams,
  GetUserQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ id: userId });

    return user;
  } catch (error) {
    console.log("Error getting user by id");
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { id, updateData, path } = params;

    await User.findOneAndUpdate({ id }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function daleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { id } = params;

    const user = await User.findOneAndDelete({ id });

    if (!user) {
      throw new Error("User not found");
    }

    // const questionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // Delete answers to questions by user

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter } = params;

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinDate: -1 };
        break;
      case "old_users":
        sortOptions = { joinDate: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query).sort(sortOptions);

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId as any);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    const { id, page = 1, pageSize = 20, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { explanation: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const skipAmount = (page - 1) * pageSize;

    const user = await User.findOne({ id }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id id name picture" },
      ],
    });

    const saved = await User.aggregate([
      {
        $project: {
          saved: 1,
          totalSaved: { $size: "$saved" },
        },
      },
    ]);

    const isNext = saved[0].totalSaved > skipAmount + user.saved.length;
    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserInfoParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20 } = params;

    const skipCount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const questions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id id name picture",
      });

    const isNext = totalQuestions > skipCount + questions.length;

    return { questions, totalQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserAnswersParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20 } = params;

    const skipCount = (page - 1) * pageSize;

    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate({
        path: "question",
        model: Question,
        select: "_id title",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id id name picture",
      });

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const isNext = totalAnswers > skipCount + answers.length;

    return {
      answers,
      totalAnswers,
      isNext,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
