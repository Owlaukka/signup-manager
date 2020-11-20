import mongoose, { Model } from "mongoose";
import { ISignup } from "../graphql/Signup/SignupSchema";

const { Schema, model } = mongoose;

export interface ISignupDocument extends mongoose.Document, ISignup {}

interface ISignupModel extends Model<ISignupDocument> {}

const SignupSchema = new Schema<ISignupDocument>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

const Signup = model<ISignupDocument, ISignupModel>("Signup", SignupSchema);

export default Signup;
