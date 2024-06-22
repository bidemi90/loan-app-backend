const express = require("express");
const {
  signup,
  open,
  login,
  addbvn,
  imageUpload,
  getUserByEmail,
  addnin,
  updateUserDetails,
  adminSignup,
  adminLogin,
  admingetAllUsers,
  deleteUserById,
  submitPersonalLoanApplication,
  submitStudentLoanApplication,
  submitAutoLoanApplication,
  fetchPersonalLoanRequests,
  fetchStudentLoanRequests,
  fetchAutoLoanRequests,
  editPersonalLoanStatus,
  editStudentLoanStatus,
  editAutoLoanStatus,
  fetchonePersonalLoanRequests,
  fetchoneStudentLoanRequests,
  fetchoneAutoLoanRequests,
  submitpaidPersonalLoanApplication,
  submitpaidStudentLoanApplication,
  submitpaidAutoLoanApplication,
  fetchonepaidpersonalloan,
  fetchonepaidStudentLoan,
  fetchonepaidAutoLoan,
  fetchpaidpersonalloan,
  fetchpaidStudentLoan,
  fetchpaidAutoLoan,
  editonepaidPersonalLoanStatus,
  editonepaidStudentLoanStatus,
  editonepaidAutoLoanStatus,
  send_mailer,
} = require("../controllers/loanappcontroller");

const loanappuserrouters = express.Router();

loanappuserrouters.get("/open", open);

loanappuserrouters.post("/signup", signup);

loanappuserrouters.post("/login", login);

loanappuserrouters.get("/getUserByEmail/:email", getUserByEmail);

loanappuserrouters.post("/addbvn", addbvn);

loanappuserrouters.post("/addnin", addnin);

loanappuserrouters.post("/updateUserDetails", updateUserDetails);

loanappuserrouters.post("/uploadimage", imageUpload);

// admin

loanappuserrouters.post("/adminSignup", adminSignup);

loanappuserrouters.post("/adminLogin", adminLogin);

loanappuserrouters.get("/admingetAllUsers", admingetAllUsers);

loanappuserrouters.delete("/deleteUserById/:id", deleteUserById);

loanappuserrouters.post("/submitPersonalLoanApplication", submitPersonalLoanApplication);

loanappuserrouters.post("/submitStudentLoanApplication", submitStudentLoanApplication);

loanappuserrouters.post("/submitAutoLoanApplication", submitAutoLoanApplication);

// 
loanappuserrouters.post("/submitpaidPersonalLoanApplication", submitpaidPersonalLoanApplication);

loanappuserrouters.post("/submitpaidStudentLoanApplication", submitpaidStudentLoanApplication);

loanappuserrouters.post("/submitpaidAutoLoanApplication", submitpaidAutoLoanApplication);

// 
loanappuserrouters.get("/fetchPersonalLoanRequests", fetchPersonalLoanRequests);

loanappuserrouters.get("/fetchStudentLoanRequests", fetchStudentLoanRequests);

loanappuserrouters.get("/fetchAutoLoanRequests", fetchAutoLoanRequests);

// 
loanappuserrouters.put('/loanrequests/:loanId', editPersonalLoanStatus);

loanappuserrouters.put('/editStudentLoanStatus/:loanId', editStudentLoanStatus);

loanappuserrouters.put('/editAutoLoanStatus/:loanId', editAutoLoanStatus);

loanappuserrouters.get('/fetchonePersonalLoanRequests/:userId', fetchonePersonalLoanRequests);

loanappuserrouters.get('/fetchoneStudentLoanRequests/:userId', fetchoneStudentLoanRequests);

loanappuserrouters.get('/fetchoneAutoLoanRequests/:userId', fetchoneAutoLoanRequests);

// 

loanappuserrouters.get('/fetchonepaidpersonalloan/:userId', fetchonepaidpersonalloan);

loanappuserrouters.get('/fetchonepaidStudentLoan/:userId', fetchonepaidStudentLoan);

loanappuserrouters.get('/fetchonepaidAutoLoan/:userId', fetchonepaidAutoLoan);

// 


loanappuserrouters.get("/fetchpaidpersonalloan", fetchpaidpersonalloan);

loanappuserrouters.get("/fetchpaidStudentLoan", fetchpaidStudentLoan);

loanappuserrouters.get("/fetchpaidAutoLoan", fetchpaidAutoLoan);

// 

loanappuserrouters.put('/editonepaidPersonalLoanStatus/:loanId', editonepaidPersonalLoanStatus);

loanappuserrouters.put('/editonepaidStudentLoanStatus/:loanId', editonepaidStudentLoanStatus);

loanappuserrouters.put('/editonepaidAutoLoanStatus/:loanId', editonepaidAutoLoanStatus);

// 
loanappuserrouters.post("/send_mailer/:userid", send_mailer);


module.exports = loanappuserrouters;
