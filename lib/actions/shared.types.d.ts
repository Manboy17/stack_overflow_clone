import { IQuestion } from "@/database/question.model";
import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
  searchQuery?: string;
  filter?: string;
}

export interface CreateQuestionParams {
  title: string;
  explanation: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface CreateUserParams {
  id: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface UpdateUserParams {
  id: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  id: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetTopTagsByUserParams {
  userId: string;
  limit?: number;
}

export interface getAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface getQuestionByIdParams {
  questionId: string;
}

export interface CreateAnswerParams {
  content: string;
  author: Schema.Types.ObjectId | IUser;
  question: Schema.Types.ObjectId | IQuestion;
  path: string;
}

export interface GetAllAnswersParams {
  questionId: string;
  filter?: string | undefined;
}

export interface VoteQuestionParams {
  userId: string;
  questionId: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  path: string;
}

export interface VoteAnswerParams {
  userId: string;
  answerId: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  path: string;
}

export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

export interface GetSavedQuestionsParams {
  id: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  filter?: string;
}

export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}

export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetUserInfoParams {
  userId: string;
}

export interface GetUserQuestionsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface GetUserAnswersParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface DeleteQuestionParams {
  itemId: string;
  path: string;
}

export interface DeleteAnswerParams {
  itemId: string;
  path: string;
}

export interface EditQuestionParams {
  questionId: string;
  title: string;
  explanation: string;
  path: string;
}
