"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteAnswerParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionsParams,
  VoteQuestionParams,
  getQuestionByIdParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { title, explanation, tags, author, path } = params;

    const question = await Question.create({
      title,
      explanation,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {
    console.log("Error creating question");
  }
}

export async function getQuestionById(params: getQuestionByIdParams) {
  try {
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({ path: "author", model: User, select: "_id id name picture" });

    if (!question) {
      throw new Error("Question not found");
    }

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: VoteQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, isUpvoted, isDownvoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: VoteQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, isUpvoted, isDownvoted, path } = params;

    let updateQuery = {};

    if (isDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (isUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvoes: userId } };
    }

    const answer = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();

    const { itemId, path } = params;

    const question = await Question.findByIdAndDelete(itemId);

    if (!question) {
      throw new Error("Question not found");
    }

    await Answer.deleteMany({ question: question._id });
    await Interaction.deleteMany({ question: question._id });
    await Tag.updateMany(
      { question: question._id },
      { $pull: { question: question._id } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    await connectToDatabase();

    const { itemId, path } = params;

    const answer = await Answer.findById(itemId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ _id: itemId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: itemId } }
    );
    await Interaction.deleteMany({ answer: itemId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, title, explanation, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.explanation = explanation;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopQuestions() {
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
