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
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "edited_at",
    },
  }
);

todoSchema.methods = {
  complete() {
    return this.set("completed", true).save();
  },
  incomplete() {
    return this.set("completed", false).save();
  },
};

todoSchema.statics = {
  findAllOwnedByUser(userId) {
    const Todo = this;
    return Todo.find({ user: userId });
  },
};

const model = mongoose.model("Todo", todoSchema);

export const schema = model.schema;
export default model;
