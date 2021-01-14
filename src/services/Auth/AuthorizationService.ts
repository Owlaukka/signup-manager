import { AuthenticationError } from "apollo-server-koa";

export enum Permissions {
  IS_LOGGED_IN = "IS_LOGGED_IN",
  ADD_EVENT = "ADD_EVENT",
  SIGNUP_TO_EVENT = "SIGNUP_TO_EVENT",
  BLOCK_ACTION = "BLOCK_ACTION",
}

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type AuthPredicate = <T extends (...args: any[]) => any>(
  action: T
) => (...args: Parameters<T>) => ReturnType<T> | null;

const isLoggedInAuthPredicate: AuthPredicate = (action) => (...args) => {
  const { user } = args[2];
  if (!user) throw new AuthenticationError("Must be logged in");
  return action(...args);
};

const signupToEventAuthPredicate: AuthPredicate = (action) => (...args) =>
  action(...args);

const nullAuthPredicate: AuthPredicate = () => () => null;

const AUTH_PREDICATES = {
  [Permissions.IS_LOGGED_IN]: isLoggedInAuthPredicate,
  [Permissions.SIGNUP_TO_EVENT]: signupToEventAuthPredicate,
  [Permissions.BLOCK_ACTION]: nullAuthPredicate,
} as const;

// K[ey] and V[alue] of AUTH_PREDICATES
type AuthorizeResolver = <K extends keyof typeof AUTH_PREDICATES>(
  permission: K
) => <V extends (...args: any[]) => any>(
  action: V
) => (...args: Parameters<V>) => ReturnType<V> | null;

export const authorizeResolver: AuthorizeResolver = (permission) => (action) =>
  AUTH_PREDICATES[permission](action);
