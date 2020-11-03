import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SignupSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

const Signup = model("Signup", SignupSchema);

export default Signup;
