/* eslint-disable import/no-cycle */
import mongoose, { Model } from "mongoose";
import EventModel, { IEventDocument } from "../Event/EventModel";
import { IUserModelDocument } from "../User/UserModel";
import { ISignup } from "./SignupSchema";

const { Schema, model } = mongoose;

export interface ISignupDocument extends mongoose.Document, ISignup {}

interface ISignupModel extends Model<ISignupDocument> {
  createSignup: CreateSignup;
  findGroupOfSignups: FindGroupOfSignups;
  removeSignup: RemoveSignup;
  confirmSignup: ConfirmSignup;
}

type CreateSignup = (
  this: ISignupModel,
  eventId: string,
  userId: IUserModelDocument
) => Promise<ISignupDocument>;

type RemoveSignup = (
  this: ISignupModel,
  eventId: string,
  user: IUserModelDocument
) => Promise<IEventDocument> | never;

type ConfirmSignup = (
  this: ISignupModel,
  signupId: string,
  isConfirmed?: boolean
) => Promise<ISignupDocument>;

type FindGroupOfSignups = (
  this: ISignupModel,
  eventIds: string[]
) => Promise<ISignupDocument[]>;

// TODO: disallow duplicates
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

const removeSignup: RemoveSignup = async function (this, eventId, currentUser) {
  try {
    const session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      const event = await EventModel.findById(eventId)
        .populate({
          path: "signups",
          match: { user: { $eq: currentUser.id } },
        })
        .session(session);
      if (!event) throw new Error("Invalid event ID given");
      if (event.signups.length === 0)
        throw new Error(
          `No signup to remove for current user on event with id: ${eventId}`
        );

      await this.deleteMany({ _id: { $in: event.signups } }).session(session);
      await event
        .updateOne({ $pull: { signups: { $in: event.signups } } })
        .session(session);
      await currentUser
        .updateOne({ $pull: { signups: { $in: event.signups } } })
        .session(session);

      result = event;
    });

    if (!result) throw new Error("Transaction failed");
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to remove a Signup from requested event");
  }
};

const confirmSignup: ConfirmSignup = async function (
  this,
  signupId,
  isConfirmed
) {
  try {
    const signup = await this.findById(signupId);

    if (!signup) throw new Error("No event exists for the given ID");

    if (typeof isConfirmed === "boolean") signup.isConfirmed = isConfirmed;
    else signup.isConfirmed = true;

    return signup.save();
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to change confirmation status for a signup: ${signupId}; status ${
        typeof isConfirmed === "boolean" ? isConfirmed : true
      }.`
    );
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
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

SignupSchema.index({ event: 1, user: 1 }, { unique: true });

SignupSchema.static("createSignup", createSignup);
SignupSchema.static("removeSignup", removeSignup);
SignupSchema.static("confirmSignup", confirmSignup);
SignupSchema.static("findGroupOfSignups", findGroupOfSignups);

const SignupModel = model<ISignupDocument, ISignupModel>(
  "Signup",
  SignupSchema
);

export default SignupModel;
