import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors from "cors";
import { apolloServer, LambdaContext } from "../src/index";
import { AuthenticationError } from "apollo-server-errors";
import { AddressInfo } from "net";
import { getTracingHeaders } from "../src/utils/http";
import { mockServer } from "../mocks/server";

export const createApp = async () => {
  const app = express();
  const apolloServerInstance = apolloServer();

  await apolloServerInstance.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware<LambdaContext>(apolloServerInstance, {
      context: async ({ req }) => {
        const clientId = req.headers["x-client-id"];

        if (!clientId) {
          throw new AuthenticationError("Missing client ID (dev server err)", {
            code: "UNAUTHENTICATED",
          });
        }

        const headers = req.headers as Record<string, string>;

        return {
          token: req.headers.token as string | undefined,
          clientId: Array.isArray(clientId) ? clientId[0] : clientId,

          headers: getTracingHeaders(headers),
        };
      },
    })
  );

  const httpServer = http.createServer(app);
  return { app, httpServer };
};

export const initServer = async () => {
  mockServer.listen();
  const { httpServer } = await createApp();

  const server = httpServer.listen(4000);

  console.log(
    `🚀 Server ready at http://localhost:${
      (server.address() as AddressInfo)?.port || "unknown"
    }/`
  );
};
