import mongoose from "mongoose";
import { EventBaseType } from "./Event";

const { Schema } = mongoose;

// export type EventBaseType = {
//   name: string;
//   description?: string;
//   maxAttendees?: number;
//   start: string;
//   end: string;
// };

interface IUserSchema extends mongoose.Document {
  email: string;
  username: string;
  password: string;
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
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const UserModel = mongoose.model<IUserSchema>("User", UserSchema);

export default UserModel;
