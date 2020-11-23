import mongoose, { Model } from "mongoose";
import { IEvent, IEventInput } from "./EventSchema";
import { IUserModelDocument } from "../User/UserModel";

const { Schema } = mongoose;

export interface IEventDocument extends mongoose.Document, IEvent {}

interface IEventModel extends Model<IEventDocument> {
  addNewEvent: AddNewEvent;
  findGroupOfEvents: FindGroupOfEvents;
}

type AddNewEvent = (
  this: IEventModel,
  eventInput: IEventInput,
  currentUser: IUserModelDocument
) => Promise<IEventDocument>;

type FindGroupOfEvents = (
  this: IEventModel,
  eventIds: string[]
) => Promise<IEventDocument[]>;

const addNewEvent: AddNewEvent = async function addNewEvent(
  this,
  { name, description, maxAttendees, start, end },
  currentUser
) {
  try {
    const newEvent = new this({
      name,
      description,
      maxAttendees,
      start: new Date(start),
      end: new Date(end),
      creator: currentUser,
    });
    const savedEvent = await newEvent.save();
    currentUser.createdEvents.push(savedEvent);
    await currentUser.save();

    return savedEvent;
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to create an Event with the following parameters: ${{
        name,
        description,
        maxAttendees,
        start,
        end,
      }}`
    );
  }
};

const findGroupOfEvents: FindGroupOfEvents = async function findGroupOfEvents(
  this,
  eventIds
) {
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
});

EventSchema.static("addNewEvent", addNewEvent);
EventSchema.static("findGroupOfEvents", findGroupOfEvents);

const EventModel: IEventModel = mongoose.model<IEventDocument, IEventModel>(
  "Event",
  EventSchema
);

export default EventModel;
