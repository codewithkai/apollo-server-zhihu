require("dotenv").config();
import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { UserAPI } from "./datasources/user";
import { ZhihuAPI } from "./datasources/zhihu";
import { User } from "./entity/User";
import { Context } from "./types";
import * as jwt from "jsonwebtoken";

createConnection({
  type: "sqlite",
  database: "db",
  entities: [User],
  synchronize: true,
  logging: false
});

const dataSources = () => ({
  zhihuAPI: new ZhihuAPI(),
  userAPI: new UserAPI()
});

// // the function that sets up the global context for each resolver, using the req
const context = async ({ req }): Promise<Context> => {
  const connection = getConnection();
  const token = (req.headers && req.headers.token) || "";
  let user = null;
  try {
    const decoded = await jwt.verify(token, "secret");
    const userId = decoded.userId;
    let userRepository = connection.getRepository(User);
    user = await userRepository.findOne(userId);
  } catch (e) {}
  return { user, connection };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  dataSources,
  context,
  resolvers,
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  }
  //mocks: true
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== "test")
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));

// // export all the important pieces for integration/e2e tests to use
// module.exports = {
//   dataSources,
//   context,
//   typeDefs,
//   resolvers,
//   ApolloServer,
//   LaunchAPI,
//   UserAPI,
//   store,
//   server
// };
