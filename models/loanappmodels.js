const mongoose = require("mongoose");

// Define the schema for the loan app user
let loanUserSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bvn: { type: Number, default: null }, // Bank Verification Number
    nin: { type: Number, default: null }, // National Identification Number
    address: { type: String, default: "" },
    dateOfBirth: { type: Date, default: "" },
    employmentStatus: { type: String, default: "" }, // e.g., Employed, Self-Employed, Unemployed
    annualIncome: { type: Number, default: 0 },
    creditScore: { type: Number, default: 0 }, // A field for storing user's credit score
    profileImage: { type: String, default: "" }, // Field for storing profile image URL
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the loan app user
let loanUserModel =
  mongoose.model.loanUserTable ||
  mongoose.model("loanUserTable", loanUserSchema);

// Export the model
module.exports = loanUserModel;
