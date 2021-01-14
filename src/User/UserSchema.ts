/* eslint-disable import/no-cycle */
import { gql } from "apollo-server-koa";
// TODO: fix this cyclical import
import { IEventDocument } from "../Event/EventModel";
import { ISignupDocument } from "../Signup/SignupModel";

export interface IUser {
  email: string;
  username: string;
  createdEvents: IEventDocument[];
  signups: ISignupDocument[];
  roles: string[];
}

export interface IUserInput {
  email?: string;
  username?: string;
  password: string;
}

export interface IAuthPayload {
  token: string | null;
}

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    createdEvents: [Event!]!
    roles: [String!]!
    signups: [Signup!]
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
