const { gql } = require("apollo-server-koa");

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

module.exports = typeDefs;
