export enum ActionTypes {
  ADD_EVENT = "ADD_EVENT",
  SIGNUP_TO_EVENT = "SIGNUP_TO_EVENT",
  BLOCK_ACTION = "BLOCK_ACTION",
}

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type AuthPredicate = <T extends (...args: any[]) => any>(
  action: T
) => (...args: Parameters<T>) => ReturnType<T> | null;

const addEventAuthPredicate: AuthPredicate = (action) => (...args) => {
  const { user } = args[2];
  if (!user) return null;
  return action(...args);
};

const signupToEventAuthPredicate: AuthPredicate = (action) => (...args) =>
  action(...args);

const nullAuthPredicate: AuthPredicate = () => () => null;

const AUTH_PREDICATES = {
  [ActionTypes.ADD_EVENT]: addEventAuthPredicate,
  [ActionTypes.SIGNUP_TO_EVENT]: signupToEventAuthPredicate,
  [ActionTypes.BLOCK_ACTION]: nullAuthPredicate,
} as const;

// K[ey] and V[alue]
type AuthorizeResolver = <
  K extends keyof typeof AUTH_PREDICATES,
  V extends (...args: any[]) => any
>(
  type: K,
  action: V
) => V | ((...args: Parameters<V>) => null);

export const authorizeResolver: AuthorizeResolver = (type, action) =>
  AUTH_PREDICATES[type](action);
