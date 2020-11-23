import { IResolvers } from "apollo-server-koa";

import User from "./UserModel";
import Event, { IEventDocument } from "../Event/EventModel";
import { IAuthPayload, IUserInput } from "./UserSchema";

interface ICreateUserInput extends IUserInput {
  email: string;
  username: string;
}

interface UserInput {
  userInput: ICreateUserInput;
}

type Login = (_: any, args: UserInput) => Promise<IAuthPayload>;

type CreateUser = (_: any, args: UserInput) => Promise<IAuthPayload>;

type CreatedEvents = (args: {
  createdEvents: string[];
}) => Promise<IEventDocument[]>;

interface Resolvers extends IResolvers {
  Query: {
    login: Login;
  };
  Mutation: {
    createUser: CreateUser;
  };
  User: {
    createdEvents: CreatedEvents;
  };
}

const resolvers: Resolvers = {
  Query: {
    login: async (_, { userInput }) => User.login(userInput),
  },
  Mutation: {
    createUser: async (_, { userInput }) => User.addNewUser(userInput),
  },
  User: {
    createdEvents: async ({ createdEvents }) =>
      Event.findGroupOfEvents(createdEvents),
  },
};

export default resolvers;
