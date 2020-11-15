import mongoose from "mongoose";
import { IEvent } from "../graphql/Event/EventSchema";

const { Schema } = mongoose;

export interface IEventModel extends mongoose.Document, IEvent {}

const EventSchema: mongoose.Schema<IEventModel> = new Schema({
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

const EventModel = mongoose.model<IEventModel>("Event", EventSchema);

export default EventModel;
