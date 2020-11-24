import { gql } from "apollo-server-koa";
// TODO: fix (only a type import-cycle)
// eslint-disable-next-line import/no-cycle
import { IUserModelDocument } from "../User/UserModel";

export interface IEvent {
  name: string;
  description?: string;
  maxAttendees: number;
  start: string;
  end: string;
  creator: IUserModelDocument;
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
    creator: User!
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
