import paseto from "paseto";
import { addWeeks } from "date-fns/fp";
import { KeyObject } from "crypto";
import { Context } from "koa";
import { IUserModel } from "../models/User";

const {
  V2: { sign, verify, generateKey },
} = paseto;

export const encodeUserIntoToken = async (
  user: IUserModel,
  privateKey: KeyObject
) => {
  try {
    const encodedUserInfo = await sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        exp: addWeeks(1)(new Date()),
      },
      privateKey
    );
    return encodedUserInfo;
  } catch (e) {
    console.error("Signing user info into a token failed", e);
    return null;
  }
};

const decodeUserFromToken = async (
  authToken: string,
  privateKey: KeyObject
) => {
  if (authToken) {
    try {
      const decoded = await verify(authToken, privateKey);
      return decoded;
    } catch (e) {
      return null;
    }
  }

  return null;
};

// eslint-disable-next-line no-return-await
const generatedPrivateKey = (async () => await generateKey("public"))();

export const generateAuthContext = async (context: Context) => {
  const privateKey = await generatedPrivateKey;
  const token = context.request.header.authorization || "";
  const user = await decodeUserFromToken(token, privateKey);
  return { user, privateKey };
};
