import { KeyObject } from "crypto";
import { IResolvers } from "apollo-server-koa";

import User from "./UserModel";
import Event from "../Event/EventModel";
import { encodeUserIntoToken } from "../helpers/auth";
import { IUserInput } from "./UserSchema";

interface ICreateUserInput extends IUserInput {
  email: string;
  username: string;
}

interface UserInput {
  userInput: ICreateUserInput;
}

interface AuthPayload {
  token: Promise<string | null>;
}

type Login = (
  _: any,
  args: UserInput,
  ctx: { privateKey: KeyObject }
) => Promise<AuthPayload>;

type CreateUser = (
  _: any,
  args: UserInput,
  ctx: { privateKey: KeyObject }
) => Promise<AuthPayload>;

interface Resolvers extends IResolvers {
  Query: {
    login: Login;
  };
  Mutation: {
    createUser: CreateUser;
  };
}

const resolvers: Resolvers = {
  Query: {
    login: async (_, { userInput }, { privateKey }) => {
      const user = await User.login(userInput);
      return {
        token: encodeUserIntoToken(user.id, privateKey),
      };
    },
  },
  Mutation: {
    createUser: async (_, { userInput }, { privateKey }) => {
      const savedUser = await User.addNewUser(userInput);
      return {
        token: encodeUserIntoToken(savedUser.id, privateKey),
      };
    },
  },
  User: {
    createdEvents: async ({ createdEvents }) =>
      Event.find({ _id: { $in: createdEvents } }),
  },
};

export default resolvers;
