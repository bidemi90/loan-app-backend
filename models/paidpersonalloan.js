const mongoose = require("mongoose");

// Define the schema for the personal loan application
let paidpersonalLoanSchema = mongoose.Schema(
  {
    loanId: { type: String, required: true },
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
    paid:{type: String ,default:""},
    reference:{type: String ,default:""}

  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the personal loan application
let paidpersonalLoan =
  mongoose.model.paidpersonalLoanTable ||
  mongoose.model("paidpersonalLoanTable", paidpersonalLoanSchema);

// Export the model
module.exports = paidpersonalLoan;
