import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    completed: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "edited_at",
    },
  }
);

const model = mongoose.model("Todo", todoSchema);

export const schema = model.schema;
export default model;
