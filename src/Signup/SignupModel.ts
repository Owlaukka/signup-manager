/* eslint-disable import/no-cycle */
import mongoose, { Model } from "mongoose";
import EventModel from "../Event/EventModel";
import { IUserModelDocument } from "../User/UserModel";
import { ISignup } from "./SignupSchema";

const { Schema, model } = mongoose;

export interface ISignupDocument extends mongoose.Document, ISignup {}

interface ISignupModel extends Model<ISignupDocument> {
  createSignup: CreateSignup;
  findGroupOfSignups: FindGroupOfSignups;
}

type CreateSignup = (
  this: ISignupModel,
  eventId: string,
  userId: IUserModelDocument
) => Promise<ISignupDocument>;

type FindGroupOfSignups = (
  this: ISignupModel,
  eventIds: string[]
) => Promise<ISignupDocument[]>;

const createSignup: CreateSignup = async function (this, eventId, currentUser) {
  try {
    const session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      const event = await EventModel.findById(eventId).session(session);

      const newSignup = new this({
        event,
        user: currentUser,
      });
      const savedSignup = await newSignup.save({ session });

      await savedSignup.user
        .updateOne({
          $push: { signups: savedSignup },
        })
        .session(session);
      await savedSignup.event
        .updateOne({
          $push: { signups: savedSignup },
        })
        .session(session);
      result = savedSignup;
    });

    if (!result) throw new Error("Transaction failed");
    return result;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to create a Signup event ${eventId}`);
  }
};

const findGroupOfSignups: FindGroupOfSignups = async function (
  this,
  signupIds
) {
  return this.find({ _id: { $in: signupIds } });
};

const SignupSchema = new Schema<ISignupDocument>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

SignupSchema.static("createSignup", createSignup);
SignupSchema.static("findGroupOfSignups", findGroupOfSignups);

const SignupModel = model<ISignupDocument, ISignupModel>(
  "Signup",
  SignupSchema
);

export default SignupModel;
