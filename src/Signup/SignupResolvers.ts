import Signup, { ISignupDocument } from "./SignupModel";
import UserModel, { IUserModelDocument } from "../User/UserModel";
import {
  authorizeResolver,
  Permissions,
} from "../services/Auth/AuthorizationService";
import EventModel, { IEventDocument } from "../Event/EventModel";

type CreateSignup = (
  _: any,
  args: { eventId: string },
  context: { user: IUserModelDocument; [x: string]: any }
) => Promise<ISignupDocument>;

type RemoveOwnSignup = (
  _: any,
  args: { eventId: string },
  context: { user: IUserModelDocument; [x: string]: any }
) => Promise<IEventDocument>;

type ConfirmSignup = (
  _: any,
  args: { signupId: string; isConfirmed?: boolean }
) => Promise<ISignupDocument>;

const loggedInAuthorizer = authorizeResolver(Permissions.IS_LOGGED_IN);
const ownEventSignupAuthorizer = authorizeResolver(
  Permissions.IS_SIGNUP_TO_OWN_EVENT
);

const createSignup: CreateSignup = async (_info, { eventId }, { user }) =>
  Signup.createSignup(eventId, user);

const removeOwnSignup: RemoveOwnSignup = async (
  _parent,
  { eventId },
  { user }
) => Signup.removeSignup(eventId, user);

const confirmSignup: ConfirmSignup = async (
  _parent,
  { signupId, isConfirmed }
) => Signup.confirmSignup(signupId, isConfirmed);

const resolvers = {
  Mutation: {
    signupToEvent: loggedInAuthorizer(createSignup),
    removeOwnSignup: loggedInAuthorizer(removeOwnSignup),
    confirmSignup: ownEventSignupAuthorizer(loggedInAuthorizer(confirmSignup)),
  },
  Signup: {
    event: async ({ event }: { event: string }) => EventModel.findById(event),
    user: async ({ user }: { user: string }) => UserModel.findById(user),
  },
};

export default resolvers;
