import { IResolvers } from "apollo-server-koa";
import Event, { IEventDocument } from "./EventModel";
import User, { IUserModelDocument } from "../User/UserModel";
import { IEventInput } from "./EventSchema";

type EventInput = {
  eventInput: IEventInput;
};

type Events = () => Promise<IEventDocument[]>;

type CreateEvent = (
  _: any,
  args: EventInput,
  context: { user: IUserModelDocument }
) => Promise<IEventDocument>;

interface Resolvers extends IResolvers {
  Query: {
    events: Events;
  };
  Mutation: {
    createEvent: CreateEvent;
  };
}

const resolvers: Resolvers = {
  Query: {
    events: async () => Event.find(),
  },
  Mutation: {
    createEvent: async (_: any, { eventInput }, { user }) =>
      Event.addNewEvent(eventInput, user),
  },
  Event: {
    // TODO: maybe add an additional security check to make sure use does not contain password.
    // The password can't be requested by the client because it isn't in the schema but it would still
    // probably be good-practise to make sure it isn't here either just to be safe.
    creator: async ({ creator }) => User.findById(creator),
  },
};

export default resolvers;
