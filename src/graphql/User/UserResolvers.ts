import bcrypt from "bcryptjs";
import { KeyObject } from "crypto";
import { IResolvers } from "apollo-server-koa";

import User from "../../models/User";
import { encodeUserIntoToken } from "../../helpers/auth";
import { IUserInput } from "./UserSchema";

type UserInput = {
  userInput: IUserInput;
};

interface AuthPayload {
  token: Promise<string | null>;
}

type Login = (
  _: any,
  {
    userInput: { username, email, password },
  }: UserInput,
  { privateKey }: { privateKey: KeyObject }
) => Promise<AuthPayload>;

type CreateUser = (
  _: any,
  {
    userInput: { username, email, password },
  }: UserInput,
  { privateKey }: { privateKey: KeyObject }
) => Promise<AuthPayload>;

interface Resolvers extends IResolvers {
  Query: {
    login: Login;
  };
  Mutation: {
    createUser: CreateUser;
  };
}

// TODO: move as much of the business logic out of the resolver to somewhere else.
const resolvers: Resolvers = {
  Query: {
    // TODO: add username possiblity login and types
    login: async (
      _: any,
      { userInput: { username, email, password } },
      { privateKey }
    ) => {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (!user) {
        throw new Error("Invalid credentials.");
      }
      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        throw new Error("Invalid credentials.");
      }
      return {
        token: encodeUserIntoToken(user, privateKey),
      };
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { userInput: { email, username, password } },
      { privateKey }
    ) => {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        throw new Error("User exists already");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      return {
        token: encodeUserIntoToken(savedUser, privateKey),
      };
    },
  },
};

export default resolvers;
