"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    const updatedQuestion = await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (!existingInteraction) return console.log("No interaction found");

      // create an interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });

      // increase user's reputation every 100 views
      if (updatedQuestion.views % 100 === 0) {
        await User.findByIdAndUpdate(userId, {
          $inc: { reputation: 5 },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
