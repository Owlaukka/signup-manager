import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import mongoose from "mongoose";
import dotenv from "dotenv";

import schema from "./graphql";

dotenv.config();

const server = new ApolloServer({ schema });
const app = new Koa();

server.applyMiddleware({ app });

mongoose.set("debug", process.env.NODE_ENV !== "production");
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-0r8xh.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
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
