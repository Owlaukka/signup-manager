import Event, { IEventDocument } from "./EventModel";
import User, { IUserModelDocument } from "../User/UserModel";
import { authorizeResolver, ActionTypes } from "../services/Auth/AuthService";
import { IEventInput } from "./EventSchema";

type CreateEvent = (
  _: any,
  args: { eventInput: IEventInput; [x: string]: any },
  context: { user: IUserModelDocument; [x: string]: any }
) => Promise<IEventDocument>;

const createEvent: CreateEvent = async (_: any, { eventInput }, { user }) =>
  Event.addNewEvent(eventInput, user);

const resolvers = {
  Query: {
    events: async () => Event.find(),
  },
  Mutation: {
    createEvent: authorizeResolver(ActionTypes.ADD_EVENT, createEvent),
  },
  Event: {
    // TODO: maybe add an additional security check to make sure use does not contain password.
    // The password can't be requested by the client because it isn't in the schema but it would still
    // probably be good-practise to make sure it isn't here either just to be safe.
    creator: async ({ creator }: { creator: IUserModelDocument }) =>
      User.findById(creator),
  },
};

export default resolvers;
