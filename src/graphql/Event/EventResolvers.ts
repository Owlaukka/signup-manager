import Event from "../../models/Event";

type EventInputType = {
  name: string;
  description: string;
  maxAttendees: number;
  start: string;
  end: string;
};

const resolvers = {
  Query: {
    events: async () => Event.find(),
  },
  Mutation: {
    createEvent: async (
      _: any,
      { name, description, maxAttendees, start, end }: EventInputType
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
