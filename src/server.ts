const Koa = require("koa");
const { ApolloServer, gql } = require("apollo-server-koa");
const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("./models/Event.ts");

const typeDefs = gql`
  type Event {
    _id: ID!
    name: String!
    description: String
    maxAttendees: Int
    start: String!
    end: String!
  }

  type Query {
    events: [Event!]!
  }

  type Mutation {
    createEvent(
      name: String!
      description: String
      maxAttendees: Int
      start: String!
      end: String!
    ): Event
  }
`;

const resolvers = {
  Query: {
    events: async () => Event.find(),
  },
  Mutation: {
    createEvent: async (
      _: any,
      { name, description, maxAttendees, start, end }: any
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

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });
// alternatively you can get a composed middleware from the apollo server
// app.use(server.getMiddleware());

mongoose.set("debug", true);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-0r8xh.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen({ port: 4000 }, () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      );
    });
  })
  .catch((err: any) => console.error(err));

export {};
