import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import dotenv from "dotenv";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";
import {
  resolvers as commonResolvers,
  typeDefs as commonTypeDefinitions,
} from "./graphql";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { BaseContext } from "@apollo/server";
import { GraphQLError } from "graphql";

dotenv.config();

export interface LambdaContext extends BaseContext {
  clientId: string;
  headers: Record<string, string | undefined>;
}

interface ContextFunctionParams {
  event: APIGatewayProxyEvent;
  context?: unknown;
}

export const apolloServer = () =>
  new ApolloServer<LambdaContext>({
    typeDefs: [...scalarTypeDefs, commonTypeDefinitions],
    resolvers: [scalarResolvers, commonResolvers],
    introspection: process.env.NODE_ENV !== "production",
    plugins: [
      process.env.NODE_ENV !== "production"
        ? ApolloServerPluginLandingPageGraphQLPlayground()
        : ApolloServerPluginLandingPageDisabled(),
      {
        async requestDidStart() {
          return {
            async didEncounterErrors({ errors }) {
              console.error("GraphQL Errors:", errors);
            },
          };
        },
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatError: (err: any) => {
      console.error("Formatted Apollo Error:", err);
      if (err?.extensions?.code === "UNAUTHENTICATED") {
        return {
          message: "Failed authentication validation",
          code: "UNAUTHENTICATED",
          statusCode: 401,
        };
      }
      return err;
    },
  });

const server = apolloServer();

const createContext = async ({ event }: ContextFunctionParams) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || "{}");
  } catch (err) {
    console.error("Error parsing event body:", err);
    throw new GraphQLError("Invalid JSON format", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  console.log("Parsed body:", parsedBody);

  const headers = event.headers || {};
  console.log("Headers:", headers);

  const normalizedHeaders: Record<string, string | undefined> = {};
  Object.entries(headers).forEach(([key, value]) => {
    normalizedHeaders[key.toLowerCase()] = value;
  });

  const clientId = normalizedHeaders["x-client-id"];

  if (!clientId) {
    console.error("Missing client ID, throwing error.");
    throw new GraphQLError("Missing client ID", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return {
    clientId,
    headers: normalizedHeaders,
  };
};

const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
  { context: createContext }
) as unknown as (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  // Handle CORS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-client-id",
      },
      body: "",
    };
  }

  const response = await graphqlHandler(event, context);

  return {
    ...response,
    headers: {
      ...response?.headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, x-client-id",
    },
  };
};
