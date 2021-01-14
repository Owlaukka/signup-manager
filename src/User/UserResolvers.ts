import User from "./UserModel";
import Event from "../Event/EventModel";
import { IUserInput } from "./UserSchema";
import SignupModel from "../Signup/SignupModel";

const resolvers = {
  Query: {
    login: async (_: any, { userInput }: { userInput: IUserInput }) =>
      User.login(userInput),
  },
  Mutation: {
    createUser: async (_: any, { userInput }: { userInput: IUserInput }) =>
      User.addNewUser(userInput),
  },
  User: {
    createdEvents: async ({ createdEvents }: { createdEvents: string[] }) =>
      Event.findGroupOfEvents(createdEvents),
    signups: async ({ signups }: { signups: string[] }) =>
      SignupModel.findGroupOfSignups(signups),
  },
};

export default resolvers;
