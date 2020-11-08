import { gql } from "apollo-server-koa";

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
