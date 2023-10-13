import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
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
