import mongoose from "mongoose";
import { ISignup } from "../graphql/Signup/SignupSchema";

const { Schema, model } = mongoose;

export interface ISignupModel extends mongoose.Document, ISignup {}

const SignupSchema = new Schema<ISignupModel>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

const Signup = model<ISignupModel>("Signup", SignupSchema);

export default Signup;
