import { mergeSchemas } from "apollo-server-koa";

import { EventSchema, EventResolvers } from "./Event";

export default mergeSchemas({
  schemas: [EventSchema],
  resolvers: [EventResolvers],
});
