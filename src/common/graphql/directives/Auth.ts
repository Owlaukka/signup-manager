import { gql, SchemaDirectiveVisitor } from "apollo-server-koa";
import { defaultFieldResolver, GraphQLField, GraphQLObjectType } from "graphql";
import { IUserModelDocument } from "../../../User/UserModel";

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<any, { user: IUserModelDocument }>,
    { objectType: { name: objectTypeName } }: { objectType: GraphQLObjectType }
  ) {
    const { resolve = defaultFieldResolver } = field;
    const { roles: acceptedRoles } = this.args;

    field.resolve = async (...args) => {
      const [, , { user: loggedUser }] = args;
      const userRoles: string[] = Array.from(loggedUser?.roles || []);
      const isRootType =
        objectTypeName === "Query" || objectTypeName === "Mutation";
      const isNotAuthorized =
        acceptedRoles?.length > 0 &&
        (userRoles.length < 1 ||
          userRoles.every(
            (userRole: string) => !acceptedRoles.includes(userRole)
          ));

      if (isNotAuthorized) {
        if (isRootType) throw new Error("Unauthorized!");
        return null;
      }
      return resolve.apply(this, args);
    };
  }
}

const AuthTypeDefs = gql`
  directive @auth(roles: [Role!]! = [USER]) on FIELD_DEFINITION
`;

export { AuthDirective, AuthTypeDefs };
