"use server";

import Answer from "@/database/answer.model";
import { CreateAnswerParams, GetAllAnswersParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();
    const { content, author, question, path } = params;

    const answer = await Answer.create({
      content,
      author,
      question,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAllAnswersParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id id name picture",
      })
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
