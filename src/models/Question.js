import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: (options) => options.length >= 2,
        message: "A question must have at least 2 options.",
      },
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    points: {
      type: Number,
      default: 1,
      min: 1,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
