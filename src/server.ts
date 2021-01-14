import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import mongoose from "mongoose";
import dotenv from "dotenv";

import schema from "./GraphQLSchema";
import { generateAuthContext } from "./common/helpers/authentication";

dotenv.config();

const server = new ApolloServer({
  schema,
  context: async ({ ctx }) => {
    const authContext = await generateAuthContext(ctx);
    return { ...authContext };
  },
});
const app = new Koa();

server.applyMiddleware({ app });

mongoose.set("debug", process.env.NODE_ENV !== "production");

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.0r8xh.gcp.mongodb.net:27017,cluster0-shard-00-01.0r8xh.gcp.mongodb.net:27017,cluster0-shard-00-02.0r8xh.gcp.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen({ port: 4000 }, () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      );
    });
  })
  .catch((err) => console.error(err));
