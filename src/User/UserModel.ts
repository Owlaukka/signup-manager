import mongoose, { HookNextFunction, Model } from "mongoose";
import bcrypt from "bcryptjs";
// eslint-disable-next-line import/no-cycle
import { IUser, IUserInput, IAuthPayload } from "./UserSchema";
// eslint-disable-next-line import/no-cycle
import { encodeUserIntoToken, generatedPrivateKey } from "../helpers/auth";

const { Schema } = mongoose;

export interface IUserModelDocument extends mongoose.Document, IUser {
  password: string;
  comparePassword: ComparePassword;
}

interface IUserModel extends Model<IUserModelDocument> {
  addNewUser: AddNewUser;
  login: Login;
}

type ComparePassword = (
  this: IUserModelDocument,
  passwordToCompareTo: string
) => Promise<void>;

type PreSaveHashHook = (
  this: IUserModelDocument,
  next: HookNextFunction
) => Promise<void>;

type AddNewUser = (
  this: IUserModel,
  userInput: IUserInput
) => Promise<IAuthPayload>;

type Login = (
  this: IUserModel,
  loginInput: IUserInput
) => Promise<IAuthPayload>;

const preSaveHashHook: PreSaveHashHook = async function save(this, next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
};

const comparePassword: ComparePassword = async function comparePassword(
  this,
  passwordToCompareTo
) {
  const isPasswordCorrect = await bcrypt.compare(
    passwordToCompareTo,
    this.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials.");
  }
};

const addNewUser: AddNewUser = async function addNewUser(
  this,
  { email, username, password }
) {
  try {
    const newUser = new this({
      email,
      username,
      password,
    });
    const savedUser = await newUser.save();
    return {
      token: await encodeUserIntoToken(savedUser.id, await generatedPrivateKey),
    };
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to create a user with username ${username} and email ${email}`
    );
  }
};

const login: Login = async function login(this, { email, username, password }) {
  const user = await this.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) throw new Error("Invalid credentials.");

  await user.comparePassword(password);

  return {
    token: await encodeUserIntoToken(user.id, await generatedPrivateKey),
  };
};

const UserSchema: mongoose.Schema<IUserModelDocument> = new Schema({
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

UserSchema.pre("save", preSaveHashHook);
UserSchema.method("comparePassword", comparePassword);
UserSchema.static("addNewUser", addNewUser);
UserSchema.static("login", login);

const UserModel: IUserModel = mongoose.model<IUserModelDocument, IUserModel>(
  "User",
  UserSchema
);

export default UserModel;
