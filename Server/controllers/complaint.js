// //controllers/complaint.js-new
// const Complaint = require("../models/Complaint");
// const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, NotFoundError } = require("../errors");

// const createComplaint = async (req, res) => {
//   const { issueType, description } = req.body;
//   const userId = req.user.id;

//   const complaint = await Complaint.create({
//     userId,
//     issueType,
//     description
//   });

//   res.status(StatusCodes.CREATED).json({ complaint });
// };

// const updateComplaint = async (req, res) => {
//   const { id: complaintId } = req.params;
//   const { status } = req.body;

//   const complaint = await Complaint.findOneAndUpdate(
//     { _id: complaintId },
//     { status },
//     { new: true, runValidators: true }
//   );

//   if (!complaint) {
//     throw new NotFoundError(`No complaint with id ${complaintId}`);
//   }

//   res.status(StatusCodes.OK).json({ complaint });
// };

// const getAllComplaints = async (req, res) => {
//   const complaints = await Complaint.find({}).populate("userId", "phone");
//   res.status(StatusCodes.OK).json({ complaints, count: complaints.length });
// };

// const getUserComplaints = async (req, res) => {
//   const complaints = await Complaint.find({ userId: req.user.id });
//   res.status(StatusCodes.OK).json({ complaints, count: complaints.length });
// };

// module.exports = {
//   createComplaint,
//   updateComplaint,
//   getAllComplaints,
//   getUserComplaints
// };

// controllers/complaint.js
import Complaint from "../models/Complaint.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createComplaint = async (req, res) => {
  const { issueType, description } = req.body;
  const userId = req.user.id;

  if (!issueType || !description) {
    throw new BadRequestError("Issue type and description are required");
  }

  try {
    const complaint = await Complaint.create({
      userId,
      issueType,
      description,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw new BadRequestError("Failed to create complaint");
  }
};

export const updateComplaint = async (req, res) => {
  const { id: complaintId } = req.params;
  const { status, adminRemarks } = req.body;

  if (!status) {
    throw new BadRequestError("Status is required to update complaint");
  }

  try {
    const complaint = await Complaint.findOneAndUpdate(
      { _id: complaintId },
      { status, adminRemarks }, // Changed from just { status }
      { new: true, runValidators: true }
    );

    if (!complaint) {
      throw new NotFoundError(`No complaint found with id ${complaintId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    throw new BadRequestError("Failed to update complaint");
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate("userId", "phone");

    res.status(StatusCodes.OK).json({
      message: "Complaints retrieved successfully",
      complaints,
      count: complaints.length,
    });
  } catch (error) {
    console.error("Error retrieving complaints:", error);
    throw new BadRequestError("Failed to retrieve complaints");
  }
};

export const getUserComplaints = async (req, res) => {
  const userId = req.user.id;

  try {
    const complaints = await Complaint.find({ userId });

    res.status(StatusCodes.OK).json({
      message: "User complaints retrieved successfully",
      complaints,
      count: complaints.length,
    });
  } catch (error) {
    console.error("Error retrieving user complaints:", error);
    throw new BadRequestError("Failed to retrieve user complaints");
  }
};

export const getComplaintById = async (req, res) => {
  const { id: complaintId } = req.params;

  try {
    const complaint = await Complaint.findById(complaintId).populate("userId", "phone");

    if (!complaint) {
      throw new NotFoundError(`No complaint found with ID ${complaintId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Complaint retrieved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error retrieving complaint:", error);
    throw new BadRequestError("Failed to retrieve complaint");
  }
};

export const deleteComplaint = async (req, res) => {
  const { id: complaintId } = req.params;

  try {
    const complaint = await Complaint.findByIdAndDelete(complaintId);

    if (!complaint) {
      throw new NotFoundError(`No complaint found with ID ${complaintId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    throw new BadRequestError("Failed to delete complaint");
  }
};


