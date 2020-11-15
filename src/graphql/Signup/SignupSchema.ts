import { gql } from "apollo-server-koa";
import { IEvent } from "../Event/EventSchema";

export interface ISignup {
  event: IEvent;
  createdAt: String;
  updatedAt: String;
}

const typeDefs = gql`
  type Signup {
    _id: ID!
    event: Event!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    signups: [Signup!]!
  }
`;

export default typeDefs;
