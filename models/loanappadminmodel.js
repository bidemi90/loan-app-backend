const mongoose = require("mongoose");

// Define the schema for the loanadmin user
let loanadminUserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "loanadmin" }, // Role can be 'loanadmin', 'superloanadmin', etc.
    profileImage: { type: String, default: "" }, // Field for storing profile image URL
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the loanadmin user
let loanadminUserModel =
  mongoose.model.loanadminUserTable ||
  mongoose.model("loanadminUserTable", loanadminUserSchema);

// Export the model
module.exports = loanadminUserModel;
