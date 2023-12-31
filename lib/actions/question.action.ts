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
  GetRecommendedQuestionsParams,
  VoteQuestionParams,
  getQuestionByIdParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    const totalQuestions = await Question.countDocuments(query);

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { explanation: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + questions.length; // questions.length => questions per page

    return { questions, isNext };
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

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tag: tagDocuments,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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

    // for upvoting/revoting the question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: isUpvoted ? -1 : 1 },
    });

    // for receiving upvote/downvote from another users
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: isUpvoted ? -10 : 10 },
    });

    await Interaction.create({
      user: userId,
      action: isUpvoted ? "unupvote_question" : "upvote_question",
      question: questionId,
    });

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
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // for downvoting/redownvoting the question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: isDownvoted ? 1 : -1 },
    });

    // for receiving downvote/upvote from another users
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: isDownvoted ? 10 : -10 },
    });

    await Interaction.create({
      user: userId,
      action: isDownvoted ? "undownvote_question" : "downvote_question",
      question: questionId,
    });

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

    const tagsToDelete = await Tag.find({ questions: itemId });

    await Question.deleteOne({ _id: itemId });
    await Answer.deleteMany({ question: itemId });
    await User.updateOne({ saved: itemId }, { $pull: { saved: itemId } });
    await Interaction.deleteMany({ question: itemId });
    await Tag.updateMany(
      { questions: itemId },
      { $pull: { questions: itemId } }
    );

    for (const tag of tagsToDelete) {
      if (tag.questions.length === 1) {
        await Tag.deleteOne({ _id: tag._id });
      }
    }

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

export async function getRecommendedQuestions(
  params: GetRecommendedQuestionsParams
) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}
