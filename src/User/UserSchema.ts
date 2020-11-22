import { gql } from "apollo-server-koa";
// TODO: fix this cyclical import
// eslint-disable-next-line import/no-cycle
import { IEvent } from "../Event/EventSchema";

export interface IUser {
  email: string;
  username: string;
  createdEvents: IEvent[];
  roles: string[];
}

export interface IUserInput {
  email?: string;
  username?: string;
  password: string;
}

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    createdEvents: [Event!]!
    roles: [String!]!
  }

  type AuthPayload {
    token: String!
  }

  input UserInput {
    email: String
    username: String
    password: String!
  }

  type Query {
    login(userInput: UserInput!): AuthPayload!
  }

  type Mutation {
    createUser(userInput: UserInput!): AuthPayload!
  }
`;

export default typeDefs;
