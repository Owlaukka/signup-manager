import mongoose from "mongoose";
import { EventBaseType } from "./Event";

const { Schema } = mongoose;

interface IUserSchema extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  roles?: string[];
  createdEvents?: EventBaseType[];
}

const UserSchema: mongoose.Schema<IUserSchema> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{ type: String }],
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const UserModel = mongoose.model<IUserSchema>("User", UserSchema);

export default UserModel;
