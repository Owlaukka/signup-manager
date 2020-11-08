import { gql } from "apollo-server-koa";

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    password: String
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
    signup(userInput: UserInput!): AuthPayload!
  }
`;

export default typeDefs;
