import paseto from "paseto";
import { addWeeks } from "date-fns/fp";
import { KeyObject } from "crypto";
import { Context } from "koa";

const {
  V2: { sign, verify, generateKey },
} = paseto;

export const encodeUserIntoToken = async (user: any, privateKey: KeyObject) => {
  try {
    const encodedUserInfo = await sign(
      { userId: user.id, email: user.email, exp: addWeeks(1)(new Date()) },
      privateKey
    );
    return encodedUserInfo;
  } catch (e) {
    console.error("Signing user info into a token failed", e);
    return null;
  }
};

// TODO: rename maybe and fix typing
export const decodeUserFromToken = async (
  authToken: string,
  key: any
): Promise<{} | null> => {
  if (authToken) {
    try {
      const decoded = await verify(authToken, key);
      return decoded;
    } catch (e) {
      return null;
    }
  }

  return null;
};

// eslint-disable-next-line no-return-await
export const generatedPrivateKey = (async () => await generateKey("public"))();

export const generateAuthContext = async (context: Context) => {
  const privateKey = await generatedPrivateKey;
  const token = context.request.header.authorization || "";
  const user = await decodeUserFromToken(token, privateKey);
  return { user, privateKey };
};
