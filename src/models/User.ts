import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../graphql/User/UserSchema";

const { Schema } = mongoose;

type ComparePassword = (
  this: IUserModel,
  passwordToCompareTo: string
) => Promise<boolean>;

export interface IUserModel extends mongoose.Document, IUser {
  password: string;
  comparePassword: ComparePassword;
}

const UserSchema: mongoose.Schema<IUserModel> = new Schema({
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

// eslint-disable-next-line func-names
const comparePassword: ComparePassword = function (this, passwordToCompareTo) {
  return bcrypt.compare(passwordToCompareTo, this.password);
};

UserSchema.method("comparePassword", comparePassword);

const UserModel = mongoose.model<IUserModel>("User", UserSchema);

export default UserModel;
