import bcrypt from "bcryptjs";
import { KeyObject } from "crypto";

import User from "../../models/User";
import { encodeUserIntoToken } from "../../helpers/auth";

type LoginInputType = {
  userInput: {
    username?: string;
    email?: string;
    password: string;
  };
};

// TODO: move as much of the business logic out of the resolver to somewhere else.
const resolvers = {
  Query: {
    // TODO: add username possiblity login and types
    login: async (
      _: any,
      { userInput: { username, email, password } }: LoginInputType,
      { privateKey }: { privateKey: KeyObject }
    ) => {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (!user) {
        throw new Error("Invalid credentials.");
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new Error("Invalid credentials.");
      }
      return {
        token: encodeUserIntoToken(user, privateKey),
      };
    },
  },
  Mutation: {
    signup: async (
      _: any,
      { userInput: { email, username, password } }: any,
      { privateKey }: any
    ): Promise<{}> => {
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
