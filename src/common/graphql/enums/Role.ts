import { gql } from "apollo-server-koa";

const RoleTypeDefs = gql`
  enum Role {
    ADMIN
    USER
    ANONYMOUS
    OWN
  }
`;

export { RoleTypeDefs };
