const bcryptjs = require("bcryptjs");
const { sendMail } = require("../utils/mailer");
// const { generatetoken } = require("../services/koloservices");
const { cloudinary } = require("../utils/cloudinaryConfig");
const loanUserModel = require("../models/loanappmodels");
const loanadminUserModel = require("../models/loanappadminmodel");
const autoLoanmodels = require("../models/autoloanmodels");
const personalLoanmodels = require("../models/personalloanmodels");
const studentLoanmodels = require("../models/studentloanmodels");
const paidautoloan = require("../models/paidautoloan");
const paidpersonalloan = require("../models/paidpersonalloan");
const paidstudentloan = require("../models/paidstudentloan");
const multer = require("multer");

// Configure multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const open = (req, res) => {
  console.log(
    "This is to test the first route from the loan app backend if it's working"
  );
  return res.status(200).send({
    message: "welcome",
    status: true,
    text: "This is to test the first route from the loan app backend if it's working",
  });
};

const signup = async (req, res, next) => {
  console.log(req.body);
  let data = req.body;

  const checkExistingDetails = await loanUserModel.findOne({
    $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
  });

  if (checkExistingDetails) {
    return res
      .status(409)
      .send({ message: "Email or phone number already in use", status: false });
  } else {
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;

    let filledform = new loanUserModel(data);
    filledform
      .save()
      .then((result) => {
        console.log(result);
        sendMail(result.email, result.firstName, "welcome");
        return res
          .status(200)
          .send({ message: "Sign up successful", status: true, result });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  }
};

const login = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    const data = req.body;
    const emailorPhonernumber = data.emailorphonernumber;
    console.log("Email or phone number provided:", emailorPhonernumber);

    const isEmail = emailorPhonernumber.includes("@");
    const query = isEmail
      ? { email: emailorPhonernumber }
      : { phoneNumber: parseInt(emailorPhonernumber, 10) };

    const found = await loanUserModel.findOne(query);
    console.log("User found:", found);

    if (!found) {
      console.log("No user found with the provided email or phone number");
      return res
        .status(409)
        .send({ message: "Invalid email or username", status: false });
    }

    const password = data.password;
    console.log("Password provided:", password);

    const compare = await bcryptjs.compare(password, found.password);
    console.log("Password match result:", compare);

    if (!compare) {
      console.log("Invalid password");
      return res
        .status(409)
        .send({ message: "Invalid password", status: false });
    }

    const email = found.email;
    // const token = generateToken(email);

    console.log("Login successful");
    return res.status(200).send({
      message: "Welcome",
      status: true,
      // token: token,
      user: found,
    });
  } catch (error) {
    console.log("Error occurred during login:", error);
    next(error);
  }
};

const getUserByEmail = async (req, res, next) => {
  console.log("Request params:", req.params);
  try {
    const { email } = req.params;

    // Log the email being searched for
    console.log("Email provided:", email);

    // Find user by email
    const user = await loanUserModel.findOne({ email: email });
    console.log("User found:", user);

    if (!user) {
      // Log if no user is found
      console.log("No user found with the provided email");
      return res.status(404).send({ message: "User not found", status: false });
    }

    // Return the found user data
    console.log("User data retrieved successfully");
    return res.status(200).send({
      message: "User data retrieved successfully",
      status: true,
      user: user,
    });
  } catch (error) {
    console.log("Error occurred while fetching user data:", error);
    next(error);
  }
};

const addbvn = async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  const emailorPhonernumber = data.emailorphonernumber;
  const bvn = data.bvn;

  const found = await loanUserModel.findOne({
    $or: [{ email: emailorPhonernumber }],
  });

  if (!found) {
    return res
      .status(409)
      .send({ message: "Invalid email or username", status: false });
  }

  found.bvn = bvn;
  await found.save();
  console.log(found.email);
  console.log(found.phoneNumber);
  return res
    .status(200)
    .send({ message: "BVN added successfully", status: true });
};

const addnin = async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  const emailorPhonernumber = data.emailorphonernumber;
  const nin = data.nin;

  try {
    const found = await loanUserModel.findOne({
      $or: [{ email: emailorPhonernumber }],
    });

    if (!found) {
      return res
        .status(409)
        .send({ message: "Invalid email or phone number", status: false });
    }

    found.nin = nin;
    await found.save();
    console.log(found.email);
    console.log(found.phoneNumber);
    return res
      .status(200)
      .send({ message: "NIN added successfully", status: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUserDetails = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    const data = req.body;
    const emailorPhonernumber = data.emailorphonernumber;
    console.log("Email or phone number provided:", emailorPhonernumber);

    const isEmail = emailorPhonernumber.includes("@");
    const query = isEmail
      ? { email: emailorPhonernumber }
      : { phoneNumber: parseInt(emailorPhonernumber, 10) };

    const found = await loanUserModel.findOne(query);
    console.log("User found:", found);

    if (!found) {
      return res
        .status(409)
        .send({ message: "Invalid email or phone number", status: false });
    }

    found.address = data.address || found.address;
    found.dateOfBirth = data.dateOfBirth || found.dateOfBirth;
    found.employmentStatus = data.employmentStatus || found.employmentStatus;
    found.annualIncome = data.annualIncome || found.annualIncome;

    await found.save();

    console.log(found);
    return res.status(200).send({
      message: "User details updated successfully",
      status: true,
      user: found,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const imageUpload = async (req, res, next) => {
  const { email } = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .send({ message: " 1 No file uploaded", status: false });
  }

  try {
    console.log(file);

    let result;
    try {
      result = await cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res.status(500).send({
              message: "Error 1 uploading image",
              status: false,
              error: error.message,
            });
          }
          return result;
        })
        .end(file.buffer);
      console.log(result);
    } catch (cloudinaryError) {
      console.error("Error uploading to Cloudinary:", cloudinaryError);
      return res.status(500).send({
        message: "Error 2 uploading image",
        status: false,
        error: cloudinaryError.message,
      });
    }

    const image_url = result.secure_url;
    const public_id = result.public_id;

    const updatedUser = await loanUserModel.findOneAndUpdate(
      { email: email },
      { profileImage: image_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found", status: false });
    }

    return res
      .status(200)
      .send({ message: "Upload successful", status: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// admincontroller

const adminSignup = async (req, res, next) => {
  console.log(req.body);
  let data = req.body;

  const checkExistingDetails = await loanadminUserModel.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });

  if (checkExistingDetails) {
    return res
      .status(409)
      .send({ message: "Email or username already in use", status: false });
  } else {
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;

    let filledform = new loanadminUserModel(data);
    filledform
      .save()
      .then((result) => {
        console.log(result);
        sendMail(result.email, result.username, "welcomeAdmin");
        return res
          .status(200)
          .send({ message: "Admin signup successful", status: true, result });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  }
};

const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await loanadminUserModel.findOne({ username });

    if (!admin) {
      return res
        .status(404)
        .send({ message: "Username not found", status: false });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcryptjs.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Incorrect password", status: false });
    }

    return res.status(200).send({
      message: "Login successful",
      status: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role, // Add other admin details if necessary
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const admingetAllUsers = async (req, res, next) => {
  try {
    const users = await loanUserModel.find({});
    return res.status(200).send({
      message: "Users retrieved successfully",
      status: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send({
      message: "An error occurred while fetching users",
      status: false,
      error: error.message,
    });
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await loanUserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).send({
      message: "User deleted successfully",
      status: true,
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send({
      message: "An error occurred while deleting the user",
      status: false,
      error: error.message,
    });
  }
};

const submitPersonalLoanApplication = async (req, res, next) => {
  try {
    const {
      userId,
      email,
      loanAmount,
      loanPurpose,
      loanTerm,
      additionalInfo,
      accountNumber,
      accountName,
      bankName,
    } = req.body;

    // Calculate loan term in days
    const loanTermInDays = loanTerm * 30;

    // Create a new personal loan application
    const newPersonalLoan = new personalLoanmodels({
      userId,
      email,
      loanAmount,
      loanPurpose,
      loanTerm: loanTermInDays,
      additionalInfo,
      accountNumber,
      accountName,
      bankName,
      status: "processing", // Set default status
    });

    // Save the personal loan application to the database
    await newPersonalLoan.save();

    return res.status(201).send({
      message: "Personal loan application submitted successfully",
      status: true,
      data: newPersonalLoan,
    });
  } catch (error) {
    console.error("Error submitting personal loan application:", error);
    return res.status(500).send({
      message:
        "An error occurred while submitting the personal loan application",
      status: false,
      error: error.message,
    });
  }
};

const submitStudentLoanApplication = async (req, res, next) => {
  try {
    const {
      userId,
      email,
      loanAmount,
      loanPurpose,
      loanTerm,
      schoolName,
      matricNumber,
      jambNumber,
      department,
      currentLevel,
      additionalInfo,
      accountNumber,
      accountName,
      bankName,
    } = req.body;

    // Calculate loan term in days
    const loanTermInDays = loanTerm * 30;

    // Create a new student loan application
    const newStudentLoan = new studentLoanmodels({
      userId,
      email,
      loanAmount,
      loanPurpose,
      loanTerm: loanTermInDays,
      schoolName,
      matricNumber,
      jambNumber,
      department,
      currentLevel,
      additionalInfo,
      accountNumber,
      accountName,
      bankName,
      status: "processing", // Set default status
    });

    // Save the student loan application to the database
    await newStudentLoan.save();

    return res.status(201).send({
      message: "Student loan application submitted successfully",
      status: true,
      data: newStudentLoan,
    });
  } catch (error) {
    console.error("Error submitting student loan application:", error);
    return res.status(500).send({
      message:
        "An error occurred while submitting the student loan application",
      status: false,
      error: error.message,
    });
  }
};

const submitAutoLoanApplication = async (req, res, next) => {
  try {
    const {
      userId,
      email,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      loanAmount,
      loanTerm,
      additionalInfo,
      accountNumber,
      accountName,
      bankName,
    } = req.body;

    // Calculate loan term in days
    const loanTermInDays = loanTerm * 30;

    // Create a new auto loan application
    const newAutoLoan = new autoLoanmodels({
      userId,
      email,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      loanAmount,
      loanTerm: loanTermInDays,
      additionalInfo,
      accountNumber,
      accountName,
      bankName,
      status: "processing", // Set default status
    });

    // Save the auto loan application to the database
    await newAutoLoan.save();

    return res.status(201).send({
      message: "Auto loan application submitted successfully",
      status: true,
      data: newAutoLoan,
    });
  } catch (error) {
    console.error("Error submitting auto loan application:", error);
    return res.status(500).send({
      message: "An error occurred while submitting the auto loan application",
      status: false,
      error: error.message,
    });
  }
};

// Controller for fetching personal loan requests
const fetchPersonalLoanRequests = async (req, res, next) => {
  try {
    // Fetch all personal loan requests from the database
    const personalLoanRequests = await personalLoanmodels.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "Personal loan requests retrieved successfully",
      data: personalLoanRequests,
    });
  } catch (error) {
    console.error("Error fetching personal loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching personal loan requests",
      error: error.message,
    });
  }
};

// Controller for fetching student loan requests
const fetchStudentLoanRequests = async (req, res, next) => {
  try {
    // Fetch all student loan requests from the database
    const studentLoanRequests = await studentLoanmodels.find({});

    // Return the fetched student loan requests
    return res.status(200).json({
      message: "Student loan requests retrieved successfully",
      data: studentLoanRequests,
    });
  } catch (error) {
    console.error("Error fetching student loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching student loan requests",
      error: error.message,
    });
  }
};

// Controller for fetching auto loan requests
const fetchAutoLoanRequests = async (req, res, next) => {
  try {
    // Fetch all auto loan requests from the database
    const autoLoanRequests = await autoLoanmodels.find({});

    // Return the fetched auto loan requests
    return res.status(200).json({
      message: "Auto loan requests retrieved successfully",
      data: autoLoanRequests,
    });
  } catch (error) {
    console.error("Error fetching auto loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching auto loan requests",
      error: error.message,
    });
  }
};

// Controller to edit the status of a personal loan request
const editPersonalLoanStatus = async (req, res, next) => {
  try {
    const { loanId } = req.params; // Extract loan ID from request parameters
    const { status, terminationreason } = req.body; // Extract new status and terminationReason from request body

    // Find the personal loan request by ID and update its status and terminationReason
    const updatedPersonalLoan = await personalLoanmodels.findByIdAndUpdate(
      loanId,
      {
        status,
        terminationreason,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPersonalLoan) {
      return res.status(404).json({
        message: "Personal loan request not found",
      });
    }

    // Return the updated personal loan request
    return res.status(200).json({
      message: "Personal loan request status updated successfully",
      data: updatedPersonalLoan,
    });
  } catch (error) {
    console.error("Error updating personal loan request status:", error);
    return res.status(500).json({
      message: "An error occurred while updating personal loan request status",
      error: error.message,
    });
  }
};

//  Controller to edit the status of a student loan request
const editStudentLoanStatus = async (req, res, next) => {
  try {
    const { loanId } = req.params; // Extract loan ID from request parameters
    const { status, terminationreason } = req.body; // Extract new status and terminationReason from request body

    // Find the personal loan request by ID and update its status and terminationReason
    const updatedStudentLoan = await studentLoanmodels.findByIdAndUpdate(
      loanId,
      {
        status,
        terminationreason,
      },
      { new: true } // Return the updated document
    );

    if (!updatedStudentLoan) {
      return res.status(404).json({
        message: "student loan request not found",
      });
    }

    // Return the updated personal loan request
    return res.status(200).json({
      message: "Student loan request status updated successfully",
      data: updatedStudentLoan,
    });
  } catch (error) {
    console.error("Error updating student loan request status:", error);
    return res.status(500).json({
      message: "An error occurred while updating student loan request status",
      error: error.message,
    });
  }
};

// Controller to edit the status of an auto loan request
const editAutoLoanStatus = async (req, res, next) => {
  try {
    const { loanId } = req.params; // Extract loan ID from request parameters
    const { status, terminationreason } = req.body; // Extract new status and terminationReason from request body

    // Find the personal loan request by ID and update its status and terminationReason
    const updatedAutoLoan = await autoLoanmodels.findByIdAndUpdate(
      loanId,
      {
        status,
        terminationreason,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAutoLoan) {
      return res.status(404).json({
        message: "auto loan request not found",
      });
    }

    // Return the updated updated auto loan request
    return res.status(200).json({
      message: "Auto loan request status updated successfully",
      data: updatedAutoLoan,
    });
  } catch (error) {
    console.error("Error updating auto loan request status:", error);
    return res.status(500).json({
      message: "An error occurred while updating auto loan request status",
      error: error.message,
    });
  }
};

const fetchonePersonalLoanRequests = async (req, res, next) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    // Fetch personal loan requests for the specific user
    const personalLoanRequests = await personalLoanmodels.find({ userId });
    console.log("personalLoanRequests");
    console.log(personalLoanRequests);
    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "Personal loan requests retrieved successfully",
      data: personalLoanRequests,
    });
  } catch (error) {
    console.error("Error fetching personal loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching personal loan requests",
      error: error.message,
    });
  }
};
const fetchoneStudentLoanRequests = async (req, res, next) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    // Fetch student loan requests for the specific user
    const studentLoanRequests = await studentLoanmodels.find({ userId });
    console.log("studentLoanRequests");
    console.log(studentLoanRequests);
    // Return the fetched student loan requests
    return res.status(200).json({
      message: "student loan requests retrieved successfully",
      data: studentLoanRequests,
    });
  } catch (error) {
    console.error("Error fetching student loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching student loan requests",
      error: error.message,
    });
  }
};
const fetchoneAutoLoanRequests = async (req, res, next) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    // Fetch auto loan requests for the specific user
    const autoLoanRequests = await autoLoanmodels.find({ userId });
    console.log("autoLoanRequests");
    console.log(autoLoanRequests);
    // Return the fetched auto loan requests
    return res.status(200).json({
      message: "auto loan requests retrieved successfully",
      data: autoLoanRequests,
    });
  } catch (error) {
    console.error("Error fetching auto loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching auto loan requests",
      error: error.message,
    });
  }
};

const submitpaidPersonalLoanApplication = async (req, res, next) => {
  const loanId = req.body._id; // Extract loan ID from request body
  const status = "successful"; // Set new status

  console.log(req.body);
  console.log(loanId);

  try {
    // Find the personal loan request by ID and update its status
    const updatedPersonalLoan = await personalLoanmodels.findByIdAndUpdate(
      loanId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedPersonalLoan) {
      console.log("Personal loan request not found");
      return res.status(404).json({
        message: "Personal loan request not found",
      });
    }

    // Proceed to create a new record in the other model
    try {
      const {
        _id,
        userId,
        email,
        loanAmount,
        loanPurpose,
        loanTerm,
        additionalInfo,
        accountNumber,
        accountName,
        bankName,
      } = updatedPersonalLoan; // Use data from the updated personal loan

      // Calculate loan term in days
      const loanTermInDays = loanTerm * 30;

      // Create a new personal loan application
      const newPersonalLoan = new paidpersonalloan({
        loanId: _id,
        userId,
        email,
        loanAmount,
        loanPurpose,
        loanTerm: loanTerm,
        additionalInfo,
        accountNumber,
        accountName,
        bankName,
        status,
      });

      // Save the personal loan application to the database
      await newPersonalLoan.save();

      return res.status(201).send({
        message: "Payment made successfully",
        status: true,
        data: newPersonalLoan,
      });
    } catch (error) {
      console.error("Error making payment:", error);
      return res.status(500).send({
        message: "An error occurred while making payment",
        status: false,
        error: error.message,
      });
    }
  } catch (error) {
    console.error(
      "An error occurred while updating personal loan request status:",
      error
    );
    return res.status(500).json({
      message: "An error occurred while updating personal loan request status",
      error: error.message,
    });
  }
};

const submitpaidStudentLoanApplication = async (req, res, next) => {
  const loanId = req.body._id; // Extract loan ID from request body
  const status = "successful"; // Set new status

  console.log(req.body);
  console.log(loanId);

  try {
    // Find the student loan request by ID and update its status
    const updatedStudentLoan = await studentLoanmodels.findByIdAndUpdate(
      loanId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedStudentLoan) {
      console.log("Student loan request not found");
      return res.status(404).json({
        message: "Student loan request not found",
      });
    }

    // Proceed to create a new record in the other model
    try {
      const {
        _id,
        userId,
        email,
        loanAmount,
        loanPurpose,
        loanTerm,
        schoolName,
        matricNumber,
        jambNumber,
        department,
        currentLevel,
        additionalInfo,
        accountNumber,
        accountName,
        bankName,
      } = updatedStudentLoan; // Use data from the updated student loan

      // Calculate loan term in days
      // const loanTermInDays = loanTerm * 30;

      // Create a new student loan application
      const newStudentLoan = new paidstudentloan({
        loanId: _id,
        userId,
        email,
        loanAmount,
        loanPurpose,
        loanTerm: loanTerm,
        schoolName,
        matricNumber,
        jambNumber,
        department,
        currentLevel,
        additionalInfo,
        accountNumber,
        accountName,
        bankName,
        status,
      });

      // Save the student loan application to the database
      await newStudentLoan.save();

      return res.status(201).send({
        message: "Payment made successfully",
        status: true,
        data: newStudentLoan,
      });
    } catch (error) {
      console.error("Error making payment:", error);
      return res.status(500).send({
        message: "An error occurred while making payment",
        status: false,
        error: error.message,
      });
    }
  } catch (error) {
    console.error(
      "An error occurred while updating student loan request status:",
      error
    );
    return res.status(500).json({
      message: "An error occurred while updating student loan request status",
      error: error.message,
    });
  }
};

const submitpaidAutoLoanApplication = async (req, res, next) => {
  const loanId = req.body._id; // Extract loan ID from request body
  const status = "successful"; // Set new status

  console.log(req.body);
  console.log(loanId);

  try {
    // Find the auto loan request by ID and update its status
    const updatedAutoLoan = await autoLoanmodels.findByIdAndUpdate(
      loanId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedAutoLoan) {
      console.log("Auto loan request not found");
      return res.status(404).json({
        message: "Auto loan request not found",
      });
    }

    // Proceed to create a new record in the other model
    try {
      const {
        _id,
        userId,
        email,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        loanAmount,
        loanTerm,
        additionalInfo,
        accountNumber,
        accountName,
        bankName,
      } = updatedAutoLoan; // Use data from the updated auto loan

      // Calculate loan term in days
      // const loanTermInDays = loanTerm * 30;

      // Create a new auto loan application
      const newAutoLoan = new paidautoloan({
        loanId: _id,
        userId,
        email,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        loanAmount,
        loanTerm: loanTerm,
        additionalInfo,
        accountNumber,
        accountName,
        bankName,
        status,
      });

      // Save the auto loan application to the database
      await newAutoLoan.save();

      return res.status(201).send({
        message: "Payment made successfully",
        status: true,
        data: newAutoLoan,
      });
    } catch (error) {
      console.error("Error making payment:", error);
      return res.status(500).send({
        message: "An error occurred while making payment",
        status: false,
        error: error.message,
      });
    }
  } catch (error) {
    console.error(
      "An error occurred while updating auto loan request status:",
      error
    );
    return res.status(500).json({
      message: "An error occurred while updating auto loan request status",
      error: error.message,
    });
  }
};

const fetchonepaidpersonalloan = async (req, res, next) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    // Fetch personal loan requests for the specific user
    const onepaidpersonalloan = await paidpersonalloan.find({ userId });
    console.log("onepaidpersonalloan");
    console.log(onepaidpersonalloan);
    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "Personal loan requests retrieved successfully",
      data: onepaidpersonalloan,
    });
  } catch (error) {
    console.error("Error fetching personal loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching personal loan requests",
      error: error.message,
    });
  }
};
const fetchonepaidStudentLoan = async (req, res, next) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    // Fetch student loan requests for the specific user
    const onepaidStudentLoan = await paidstudentloan.find({ userId });
    console.log("onepaidStudentLoan");
    console.log(onepaidStudentLoan);
    // Return the fetched student loan requests
    return res.status(200).json({
      message: "student loan requests retrieved successfully",
      data: onepaidStudentLoan,
    });
  } catch (error) {
    console.error("Error fetching student loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching student loan requests",
      error: error.message,
    });
  }
};
const fetchonepaidAutoLoan = async (req, res, next) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    // Fetch auto loan requests for the specific user
    const onepaidAutoLoan = await paidautoloan.find({ userId });
    console.log("onepaidAutoLoan");
    console.log(onepaidAutoLoan);
    // Return the fetched auto loan requests
    return res.status(200).json({
      message: "auto loan requests retrieved successfully",
      data: onepaidAutoLoan,
    });
  } catch (error) {
    console.error("Error fetching auto loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching auto loan requests",
      error: error.message,
    });
  }
};

// Controller for fetching paid personal loan requests
const fetchpaidpersonalloan = async (req, res, next) => {
  try {
    // Fetch all personal loan requests from the database
    const Paidpersonalloan = await paidpersonalloan.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "Personal loan requests retrieved successfully",
      data: Paidpersonalloan,
    });
  } catch (error) {
    console.error("Error fetching personal loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching personal loan requests",
      error: error.message,
    });
  }
};

// Controller for fetching paid student loan requests
const fetchpaidStudentLoan = async (req, res, next) => {
  try {
    // Fetch all student loan requests from the database
    const paidStudentLoan = await paidstudentloan.find({});

    // Return the fetched student loan requests
    return res.status(200).json({
      message: "Student loan requests retrieved successfully",
      data: paidStudentLoan,
    });
  } catch (error) {
    console.error("Error fetching student loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching student loan requests",
      error: error.message,
    });
  }
};

// Controller for fetching paid auto loan requests
const fetchpaidAutoLoan = async (req, res, next) => {
  try {
    // Fetch all auto loan requests from the database
    const paidAutoLoan = await paidautoloan.find({});

    // Return the fetched auto loan requests
    return res.status(200).json({
      message: "Auto loan requests retrieved successfully",
      data: paidAutoLoan,
    });
  } catch (error) {
    console.error("Error fetching auto loan requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching auto loan requests",
      error: error.message,
    });
  }
};

// Controller to edit the status of a personal loan request
const editonepaidPersonalLoanStatus = async (req, res, next) => {
  try {
    const { loanId } = req.params; // Extract loan ID from request parameters
    const paid = "successful"; // Set the status to successful

    // Find the personal loan request by ID and update its status
    const updatedPersonalLoan = await paidpersonalloan.findByIdAndUpdate(
      loanId,
      { paid },
      { new: true } // Return the updated document
    );

    console.log(loanId);
    console.log(paid);
    console.log(updatedPersonalLoan);

    if (!updatedPersonalLoan) {
      return res.status(404).json({
        message: "Personal loan request not found",
      });
    }

    // Return the updated personal loan request
    return res.status(200).json({
      message: "Personal loan repayment successful",
      data: updatedPersonalLoan,
    });
  } catch (error) {
    console.error("Error making Personal loan repayment:", error);
    return res.status(500).json({
      message: "An error occurred while making Personal loan repayment",
      error: error.message,
    });
  }
};

// Controller to edit the status of a student loan request
const editonepaidStudentLoanStatus = async (req, res, next) => {
  try {
    const { loanId } = req.params; // Extract loan ID from request parameters
    const paid = "successful"; // Set the status to successful

    // Find the student loan request by ID and update its status
    const updatedStudentLoan = await paidstudentloan.findByIdAndUpdate(
      loanId,
      { paid },
      { new: true } // Return the updated document
    );

    if (!updatedStudentLoan) {
      return res.status(404).json({
        message: "Student loan request not found",
      });
    }

    // Return the updated student loan request
    return res.status(200).json({
      message: "Student loan repayment successful",
      data: updatedStudentLoan,
    });
  } catch (error) {
    console.error("Error making Student loan repayment:", error);
    return res.status(500).json({
      message: "An error occurred while making Student loan repayment",
      error: error.message,
    });
  }
};

// Controller to edit the status of an auto loan request

const editonepaidAutoLoanStatus = async (req, res, next) => {
  try {
    const { loanId } = req.params; // Extract loan ID from request parameters
    const paid = "successful"; // Set the status to successful

    // Find the auto loan request by ID and update its status
    const updatedAutoLoan = await paidautoloan.findByIdAndUpdate(
      loanId,
      { paid },
      { new: true } // Return the updated document
    );

    if (!updatedAutoLoan) {
      return res.status(404).json({
        message: "Auto loan request not found",
      });
    }

    // Return the updated auto loan request
    return res.status(200).json({
      message: "Auto loan repayment successful",
      data: updatedAutoLoan,
    });
  } catch (error) {
    console.error("Error making Auto loan repayment:", error);
    return res.status(500).json({
      message: "An error occurred while making Auto loan repayment",
      error: error.message,
    });
  }
};

const send_mailer = async (req, res, next) => {
  try {
    const { userid } = req.params;
    console.log(userid);

    // Assuming userid is a string, you can directly query by _id
    const checkExistingDetails = await loanUserModel.findOne({ _id: userid });

    // Check if user details are found
    if (!checkExistingDetails) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    // Send email using the retrieved user details
    await sendMail(
      checkExistingDetails.email,
      checkExistingDetails.firstName,
      "legalAction"
    );

    return res.status(200).json({
      message: "Mail sent successfully",
      status: true,
      checkExistingDetails,
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).json({
      message: "Failed to send mail",
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  open,
  login,
  addbvn,
  imageUpload,
  addnin,
  getUserByEmail,
  updateUserDetails,

  // admin
  adminSignup,
  adminLogin,
  admingetAllUsers,
  deleteUserById,
  submitPersonalLoanApplication,
  submitStudentLoanApplication,
  submitAutoLoanApplication,
  //
  fetchPersonalLoanRequests,
  fetchStudentLoanRequests,
  fetchAutoLoanRequests,
  //
  editPersonalLoanStatus,
  editStudentLoanStatus,
  editAutoLoanStatus,
  //
  fetchonePersonalLoanRequests,
  fetchoneStudentLoanRequests,
  fetchoneAutoLoanRequests,
  //
  submitpaidPersonalLoanApplication,
  submitpaidStudentLoanApplication,
  submitpaidAutoLoanApplication,
  //
  fetchonepaidpersonalloan,
  fetchonepaidStudentLoan,
  fetchonepaidAutoLoan,
  //
  fetchpaidpersonalloan,
  fetchpaidStudentLoan,
  fetchpaidAutoLoan,
  //
  editonepaidPersonalLoanStatus,
  editonepaidStudentLoanStatus,
  editonepaidAutoLoanStatus,
  send_mailer,
};
