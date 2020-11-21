import paseto from "paseto";
import { addWeeks } from "date-fns/fp";
import { KeyObject } from "crypto";
import { Context } from "koa";

import User, { IUserModelDocument } from "../models/User";

const {
  V2: { sign, verify, generateKey },
} = paseto;

interface IAuthToken {
  userId: string;
  exp: Date;
}

interface IAuthContext {
  user: IUserModelDocument | null;
  privateKey: KeyObject;
}

type EncodeUserInfo = (
  userId: string,
  privateKey: KeyObject
) => Promise<string | null>;

type DecodeAuthToken = (
  authToken: string,
  privateKey: KeyObject
) => Promise<IAuthToken | null>;

type GenerateAuthContext = (context: Context) => Promise<IAuthContext>;

export const encodeUserIntoToken: EncodeUserInfo = async (
  userId,
  privateKey
) => {
  try {
    const authTokenInfo = {
      userId,
      exp: addWeeks(1)(new Date()),
    };
    const encodedUserInfo = await sign(authTokenInfo, privateKey);
    return encodedUserInfo;
  } catch (e) {
    console.error("Signing user info into a token failed", e);
    return null;
  }
};

const decodeAuthToken: DecodeAuthToken = async (authToken, privateKey) => {
  if (!authToken) return null;
  try {
    return (await verify(authToken, privateKey)) as IAuthToken;
  } catch (e) {
    return null;
  }
};

// eslint-disable-next-line no-return-await
const generatedPrivateKey = (async () => await generateKey("public"))();

export const generateAuthContext: GenerateAuthContext = async (context) => {
  const privateKey = await generatedPrivateKey;
  const token = context.request.header.authorization || "";
  const decodedUserInfo = await decodeAuthToken(token, privateKey);
  const user = await User.findById(decodedUserInfo?.userId);
  return { user, privateKey };
};
