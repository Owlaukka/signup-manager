import { mergeSchemas } from "apollo-server-koa";

import { EventSchema, EventResolvers } from "./Event";
import { UserSchema, UserResolvers } from "./User";

export default mergeSchemas({
  schemas: [EventSchema, UserSchema],
  resolvers: [EventResolvers, UserResolvers],
});
