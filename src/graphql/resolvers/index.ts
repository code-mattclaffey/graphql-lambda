import { mergeResolvers } from "@graphql-tools/merge";
import healthCheck from "./healthCheck";

export default mergeResolvers([healthCheck]);
