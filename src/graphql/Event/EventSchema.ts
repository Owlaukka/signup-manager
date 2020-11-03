import { gql } from "apollo-server-koa";

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

export default typeDefs;
