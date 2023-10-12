import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export async function getUserById(params: any) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ id: userId });

    return user;
  } catch (error) {
    console.log("Error getting user by id");
  }
}
