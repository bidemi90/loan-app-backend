const mongoose = require("mongoose");

// Define the schema for the personal loan application
let personalLoanSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    loanPurpose: { type: String, required: true },
    loanTerm: { type: Number, required: true }, // Store loan term in days
    additionalInfo: { type: String, default: "" },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    status: { type: String, default: "processing" }, // Status field with default value
    terminationreason: { type: String, default: "" }, 
    

  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the personal loan application
let personalLoanModel =
  mongoose.model.personalLoanTable ||
  mongoose.model("personalLoanTable", personalLoanSchema);

// Export the model
module.exports = personalLoanModel;
