import Signup, { ISignupDocument } from "./SignupModel";
import UserModel, { IUserModelDocument } from "../User/UserModel";
import {
  authorizeResolver,
  Permissions,
} from "../services/Auth/AuthorizationService";
import EventModel from "../Event/EventModel";

type CreateSignup = (
  _: any,
  args: { eventId: string },
  context: { user: IUserModelDocument; [x: string]: any }
) => Promise<ISignupDocument>;

const loggedInAuthorizer = authorizeResolver(Permissions.IS_LOGGED_IN);

const createSignup: CreateSignup = async (_info, { eventId }, { user }) =>
  Signup.createSignup(eventId, user);

const resolvers = {
  Mutation: {
    signupToEvent: loggedInAuthorizer(createSignup),
    removeSignup: loggedInAuthorizer(async () => null),
  },
  Signup: {
    event: async ({ event }: { event: string }) => EventModel.findById(event),
    user: async ({ user }: { user: string }) => UserModel.findById(user),
  },
};

export default resolvers;
