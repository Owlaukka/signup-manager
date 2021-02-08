import { AuthenticationError } from "apollo-server-koa";
import EventModel from "../../Event/EventModel";

export enum Permissions {
  IS_LOGGED_IN = "IS_LOGGED_IN",
  IS_OWN_EVENT = "IS_OWN_EVENT",
  BLOCK_ACTION = "BLOCK_ACTION",
}

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type AuthPredicate = <T extends (...args: any[]) => any>(
  action: T
) => (
  ...args: Parameters<T>
) => ReturnType<T> | Promise<ReturnType<T>> | null | never;

const isLoggedInAuthPredicate: AuthPredicate = (action) => (...args) => {
  const { user } = args[2];
  if (!user) throw new AuthenticationError("Must be logged in");
  return action(...args);
};

const isOwnEventAuthPredicate: AuthPredicate = (action) => async (...args) => {
  const { user } = args[2]; // context
  const [eventId] = args[1]; // resolver arguments
  const event = await EventModel.findById(eventId).populate("user");
  if (event?.creator.id !== user.id)
    throw new AuthenticationError("Not allowed to modify someone else's event");
  return action(...args);
};

const nullAuthPredicate: AuthPredicate = () => () => null;

const AUTH_PREDICATES = {
  [Permissions.IS_LOGGED_IN]: isLoggedInAuthPredicate,
  [Permissions.IS_OWN_EVENT]: isOwnEventAuthPredicate,
  [Permissions.BLOCK_ACTION]: nullAuthPredicate,
} as const;

// K[ey] and V[alue] of AUTH_PREDICATES
type AuthorizeResolver = <K extends keyof typeof AUTH_PREDICATES>(
  permission: K
) => <V extends (...args: any[]) => any>(
  action: V
) => (...args: Parameters<V>) => ReturnType<V> | Promise<ReturnType<V>> | null;

export const authorizeResolver: AuthorizeResolver = (permission) => (action) =>
  AUTH_PREDICATES[permission](action);
