import Event, { IEventDocument } from "./EventModel";
import User, { IUserModelDocument } from "../User/UserModel";
import {
  authorizeResolver,
  Permissions,
} from "../services/Auth/AuthorizationService";
import { IEventInput } from "./EventSchema";
import SignupModel from "../Signup/SignupModel";

type CreateEvent = (
  _: any,
  args: { eventInput: IEventInput; [x: string]: any },
  context: { user: IUserModelDocument; [x: string]: any }
) => Promise<IEventDocument>;

type ModifyEvent = (
  _: any,
  args: { id: string; eventInput: IEventInput; [x: string]: any }
) => Promise<IEventDocument>;

const createEvent: CreateEvent = async (_: any, { eventInput }, { user }) =>
  Event.addNewEvent(eventInput, user);

const updateEvent: ModifyEvent = async (_: any, { id, eventInput }) =>
  Event.modifyEvent(id, eventInput);

const isLoggedInAuthorizer = authorizeResolver(Permissions.IS_LOGGED_IN);
const isOwnEventAuthorizer = authorizeResolver(Permissions.IS_LOGGED_IN);
const resolvers = {
  Query: {
    events: async () => Event.find(),
    event: async (_parent: any, { eventId }: { eventId: string }) =>
      Event.findById(eventId),
  },
  Mutation: {
    createEvent: isLoggedInAuthorizer(createEvent),
    updateEvent: isOwnEventAuthorizer(isLoggedInAuthorizer(updateEvent)),
  },
  Event: {
    // TODO: maybe add an additional security check to make sure use does not contain password.
    // The password can't be requested by the client because it isn't in the schema but it would still
    // probably be good-practise to make sure it isn't here either just to be safe.
    creator: async ({ creator }: { creator: string }) => User.findById(creator),
    signups: async ({ signups }: { signups: string[] }) =>
      SignupModel.findGroupOfSignups(signups),
  },
};

export default resolvers;
