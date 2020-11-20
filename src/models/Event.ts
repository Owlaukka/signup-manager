import mongoose, { Model } from "mongoose";
import { IEvent, IEventInput } from "../graphql/Event/EventSchema";

const { Schema } = mongoose;

export interface IEventDocument extends mongoose.Document, IEvent {}

interface IEventModel extends Model<IEventDocument> {
  addNewEvent: AddNewEvent;
}

type AddNewEvent = (
  this: IEventModel,
  eventInput: IEventInput
) => Promise<IEventDocument>;

const addNewEvent: AddNewEvent = async function addNewEvent(
  this,
  { name, description, maxAttendees, start, end }
) {
  try {
    const newEvent = new this({
      name,
      description,
      maxAttendees,
      start: new Date(start),
      end: new Date(end),
    });
    return newEvent.save();
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
});

EventSchema.static("addNewEvent", addNewEvent);

const EventModel: IEventModel = mongoose.model<IEventDocument, IEventModel>(
  "Event",
  EventSchema
);

export default EventModel;
