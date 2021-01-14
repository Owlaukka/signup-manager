import { makeExecutableSchema } from "apollo-server-koa";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { EventSchema, EventResolvers } from "./Event";
import { UserSchema, UserResolvers } from "./User";
import { SignupSchema, SignupResolvers } from "./Signup";
import {
  enumTypeDefs,
  schemaDirectiveTypeDefs,
  schemaDirectives,
} from "./common/graphql";

export default makeExecutableSchema({
  schemaDirectives,
  typeDefs: mergeTypeDefs([
    EventSchema,
    UserSchema,
    SignupSchema,
    schemaDirectiveTypeDefs,
    enumTypeDefs,
  ]),
  resolvers: mergeResolvers([EventResolvers, UserResolvers, SignupResolvers]),
});
