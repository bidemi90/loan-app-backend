const mongoose = require("mongoose");

// Define the schema for the student loan application
let paidstudentLoanSchema = mongoose.Schema(
  {
    loanId: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    loanPurpose: { type: String, required: true },
    loanTerm: { type: Number, required: true }, // Store loan term in days
    schoolName: { type: String, required: true },
    matricNumber: { type: String, required: true },
    jambNumber: { type: String, required: true },
    department: { type: String, required: true },
    currentLevel: { type: String, required: true },
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

// Create the model for the student loan application
let paidstudentLoan =
  mongoose.model.paidstudentLoanTable ||
  mongoose.model("paidstudentLoanTable", paidstudentLoanSchema);

// Export the model
module.exports = paidstudentLoan;
