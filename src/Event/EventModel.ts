/* eslint-disable import/no-cycle */
import mongoose, { Model } from "mongoose";
import { IEvent, IEventInput } from "./EventSchema";
import { IUserModelDocument } from "../User/UserModel";
import { ISignupDocument } from "../Signup/SignupModel";

const { Schema } = mongoose;

// TYPES =================================================================
export interface IEventDocument extends mongoose.Document, IEvent {
  signups: ISignupDocument[];
}

interface IEventModel extends Model<IEventDocument> {
  addNewEvent: AddNewEvent;
  findGroupOfEvents: FindGroupOfEvents;
}

type AddNewEvent = (
  this: IEventModel,
  eventInput: IEventInput,
  currentUser: IUserModelDocument | null
) => Promise<IEventDocument>;

type FindGroupOfEvents = (
  this: IEventModel,
  eventIds: string[]
) => Promise<IEventDocument[]>;
// =============================================================================

const addNewEvent: AddNewEvent = async function (
  this,
  { name, description, maxAttendees, start, end },
  currentUser
) {
  try {
    const session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      const newEvent = new this({
        name,
        description,
        maxAttendees,
        start: new Date(start),
        end: new Date(end),
        creator: currentUser,
      });
      result = await newEvent.save();

      await result.creator.updateOne({
        $push: { createdEvents: result },
      });
    });

    if (!result) throw new Error("Transaction failed");
    return result;
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to create an Event with the following parameters: ${name}, ${description}, ${maxAttendees}, ${start} and ${end}`
    );
  }
};

const findGroupOfEvents: FindGroupOfEvents = async function (this, eventIds) {
  return this.find({ _id: { $in: eventIds } });
};

const EventSchema: mongoose.Schema<IEventDocument> = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    maxlength: 250,
  },
  maxAttendees: {
    type: Number,
    default: 10,
    min: 1,
    max: 55,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  signups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Signup",
    },
  ],
});

EventSchema.static("addNewEvent", addNewEvent);
EventSchema.static("findGroupOfEvents", findGroupOfEvents);

const EventModel = mongoose.model<IEventDocument, IEventModel>(
  "Event",
  EventSchema
);

export default EventModel;
