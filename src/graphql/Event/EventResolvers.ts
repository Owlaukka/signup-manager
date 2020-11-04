import Event, { EventBaseType } from "../../models/Event";

const resolvers = {
  Query: {
    events: async () => Event.find(),
  },
  Mutation: {
    createEvent: async (
      _: any,
      { name, description, maxAttendees, start, end }: EventBaseType
    ) => {
      const newEvent = new Event({
        name,
        description,
        maxAttendees,
        start: new Date(start),
        end: new Date(end),
      });
      return newEvent.save();
    },
  },
};

export default resolvers;
