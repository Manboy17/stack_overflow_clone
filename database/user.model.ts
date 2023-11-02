import { Schema, model, models } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture?: string;
  userLocation?: string;
  portfolioLink?: string;
  reputation?: number;
  joinDate: Date;
  saved: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  bio: { type: String },
  picture: { type: String },
  userLocation: { type: String },
  portfolioLink: { type: String },
  reputation: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

const User = models.User || model("User", UserSchema);

export default User;
