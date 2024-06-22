const mongoose = require("mongoose");

// Define the schema for the auto loan application
let paidautoLoanSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    loanId: { type: String, required: true },
    email: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleYear: { type: Number, required: true },
    loanAmount: { type: Number, required: true },
    loanTerm: { type: Number, required: true }, // Store loan term in days
    additionalInfo: { type: String, default: "" },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    status: { type: String, default: "processing" }, // Status field with default value
    terminationreason: { type: String, default: "" }, 
    paid:{type: String ,default:""},
    reference:{type: String ,default:""}

  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the auto loan application
let paidautoLoan =
  mongoose.model.paidautoLoanTable ||
  mongoose.model("paidautoLoanTable", paidautoLoanSchema);

// Export the model
module.exports = paidautoLoan;
