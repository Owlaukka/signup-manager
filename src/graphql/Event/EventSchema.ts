import { gql } from "apollo-server-koa";

export interface IEvent {
  name: string;
  description?: string;
  maxAttendees: number;
  start: string;
  end: string;
}

export interface IEventInput {
  name: string;
  description?: string;
  maxAttendees?: number;
  start: string;
  end: string;
}

const typeDefs = gql`
  type Event {
    _id: ID!
    name: String!
    description: String
    maxAttendees: Int!
    start: String!
    end: String!
  }

  input EventInput {
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
    createEvent(eventInput: EventInput!): Event
  }
`;

export default typeDefs;
