import mongoose from "mongoose";

const { Schema } = mongoose;

export type EventBaseType = {
  name: string;
  description?: string;
  maxAttendees?: number;
  start: string;
  end: string;
};

interface IEventSchema extends mongoose.Document, EventBaseType {
  name: string;
  description?: string;
  maxAttendees?: number;
  start: string;
  end: string;
}

const EventSchema: mongoose.Schema<IEventSchema> = new Schema({
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

const EventModel = mongoose.model<IEventSchema>("Event", EventSchema);

export default EventModel;
