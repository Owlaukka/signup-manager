import { IResolvers } from "apollo-server-koa";
import Event from "../../models/Event";
import { IEvent, IEventInput } from "./EventSchema";

type EventInput = {
  eventInput: IEventInput;
};

type Events = () => Promise<IEvent[]>;

type CreateEvent = (_: any, { eventInput }: EventInput) => Promise<IEvent>;

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
    createEvent: async (_: any, { eventInput }) =>
      Event.addNewEvent(eventInput),
  },
};

export default resolvers;
