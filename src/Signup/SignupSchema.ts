/* eslint-disable import/no-cycle */
import { gql } from "apollo-server-koa";
import { IEventDocument } from "../Event/EventModel";
import { IUserModelDocument } from "../User/UserModel";

export interface ISignup {
  event: IEventDocument;
  user: IUserModelDocument;
  createdAt: String;
  updatedAt: String;
}

const typeDefs = gql`
  type Signup {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    signupToEvent(eventId: String!): Signup
    removeOwnSignup(eventId: String!): Event
  }
`;

export default typeDefs;
