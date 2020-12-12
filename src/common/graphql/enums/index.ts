import { mergeTypeDefs } from "@graphql-tools/merge";
import { RoleTypeDefs } from "./Role";

const enumTypeDefs = mergeTypeDefs([RoleTypeDefs]);

export { enumTypeDefs };
