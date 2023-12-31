"use server";

import Answer from "@/database/answer.model";
import {
  CreateAnswerParams,
  GetAllAnswersParams,
  VoteAnswerParams,
} from "./shared.types";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();
    const { content, author, question, path } = params;

    const answer = await Answer.create({
      content,
      author,
      question,
    });

    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: answer._id,
      tags: questionObject.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAllAnswersParams) {
  try {
    await connectToDatabase();

    const { questionId, filter } = params;

    let sortOptions = {};

    switch (filter) {
      case "highestupvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestupvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id id name picture",
      })
      .sort(sortOptions);

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: VoteAnswerParams) {
  try {
    await connectToDatabase();

    const { userId, answerId, isUpvoted, isDownvoted, path } = params;

    let updateQuery = {};

    if (isUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (isDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // we upvote/reupvote the answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: isUpvoted ? -2 : 2 },
    });

    // we receive upvote/downvote from another users
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: isUpvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: VoteAnswerParams) {
  try {
    await connectToDatabase();

    const { userId, answerId, isUpvoted, isDownvoted, path } = params;

    let updateQuery = {};

    if (isDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (isUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // we downvote/redownvote the answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: isDownvoted ? 2 : -2 },
    });

    // we receive upvote/downvote from another users
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: isDownvoted ? 10 : -10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
