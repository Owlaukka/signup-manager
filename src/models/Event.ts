import mongoose from "mongoose";

const { Schema } = mongoose;

// TODO: move these types somewhere reusable or where it makes sense
interface EventInputType extends mongoose.Document {
  name: string;
  description: string;
  maxAttendees: number;
  start: string;
  end: string;
}

const EventSchema: mongoose.Schema<EventInputType> = new Schema({
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

const EventModel = mongoose.model<EventInputType>("Event", EventSchema);

export default EventModel;
