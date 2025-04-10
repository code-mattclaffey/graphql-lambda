import { mergeTypeDefs } from "@graphql-tools/merge";
import healthCheck from "./healthCheck";

export default mergeTypeDefs([healthCheck]);
