import { mergeTypeDefs } from "@graphql-tools/merge";
import { AuthDirective, AuthTypeDefs } from "./Auth";

const schemaDirectives = {
  auth: AuthDirective,
};

const schemaDirectiveTypeDefs = mergeTypeDefs([AuthTypeDefs]);

export { schemaDirectives, schemaDirectiveTypeDefs };
