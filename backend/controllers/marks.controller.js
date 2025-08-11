const Marks = require("../models/marks.model");
const StudentDetail = require("../models/details/student-details.model");
const Subject = require("../models/subject.model");
const ApiResponse = require("../utils/ApiResponse");

// Get all marks with optional filters
const getAllMarksController = async (req, res, next) => {
  try {
    const { studentId, subjectId, examId } = req.query;
    
    let query = {};
    
    if (studentId) query.studentId = studentId;
    if (subjectId) query.subjectId = subjectId;
    if (examId) query.examId = examId;

    const marks = await Marks.find(query)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("subjectId", "name")
      .populate("examId", "name");

    if (!marks || marks.length === 0) {
      return ApiResponse.notFound("No marks found").send(res);
    }

    return ApiResponse.success(marks, "Marks retrieved successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Add marks for a student
const addMarksController = async (req, res, next) => {
  try {
    const { studentId, subjectId, examId, marks } = req.body;

    // Check if marks already exist for this student, subject, and exam
    const existingMarks = await Marks.findOne({
      studentId,
      subjectId,
      examId,
    });

    if (existingMarks) {
      return ApiResponse.conflict("Marks already exist for this student, subject, and exam").send(res);
    }

    const newMarks = await Marks.create(req.body);
    
    const populatedMarks = await Marks.findById(newMarks._id)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("subjectId", "name")
      .populate("examId", "name");

    return ApiResponse.created(populatedMarks, "Marks added successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Update marks
const updateMarksController = async (req, res, next) => {
  try {
    const updatedMarks = await Marks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("studentId", "firstName lastName enrollmentNo")
     .populate("subjectId", "name")
     .populate("examId", "name");

    if (!updatedMarks) {
      return ApiResponse.notFound("Marks not found").send(res);
    }

    return ApiResponse.success(updatedMarks, "Marks updated successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Delete marks
const deleteMarksController = async (req, res, next) => {
  try {
    const marks = await Marks.findByIdAndDelete(req.params.id);

    if (!marks) {
      return ApiResponse.notFound("Marks not found").send(res);
    }

    return ApiResponse.success(null, "Marks deleted successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Add bulk marks - TODO: Add validation for marks range
const addBulkMarksController = async (req, res, next) => {
  try {
    const { marksData } = req.body;

    if (!Array.isArray(marksData) || marksData.length === 0) {
      return ApiResponse.badRequest("Invalid marks data").send(res);
    }

    const results = [];
    const errors = [];

    for (const markData of marksData) {
      try {
        // Check if marks already exist
        const existingMarks = await Marks.findOne({
          studentId: markData.studentId,
          subjectId: markData.subjectId,
          examId: markData.examId,
        });

        if (existingMarks) {
          errors.push(`Marks already exist for student ${markData.studentId}`);
          continue;
        }

        const newMarks = await Marks.create(markData);
        results.push(newMarks);
      } catch (error) {
        errors.push(`Error adding marks for student ${markData.studentId}: ${error.message}`);
      }
    }

    return ApiResponse.success(
      { 
        added: results.length, 
        errors: errors.length,
        errorDetails: errors 
      },
      `Bulk marks operation completed. Added: ${results.length}, Errors: ${errors.length}`
    ).send(res);
  } catch (error) {
    console.error("Error in addBulkMarksController:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Get students with their marks
const getStudentsWithMarksController = async (req, res, next) => {
  try {
    const { examId, subjectId } = req.query;

    if (!examId || !subjectId) {
      return ApiResponse.badRequest("Exam ID and Subject ID are required").send(res);
    }

    const marks = await Marks.find({ examId, subjectId })
      .populate("studentId", "firstName lastName enrollmentNo semester branchId")
      .populate("subjectId", "name")
      .populate("examId", "name");

    if (!marks || marks.length === 0) {
      return ApiResponse.notFound("No marks found for this exam and subject").send(res);
    }

    return ApiResponse.success(marks, "Students with marks retrieved successfully").send(res);
  } catch (error) {
    console.error("Error in getStudentsWithMarksController:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Get marks for a specific student
const getStudentMarksController = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const marks = await Marks.find({ studentId })
      .populate("subjectId", "name")
      .populate("examId", "name")
      .sort({ createdAt: -1 });

    if (!marks || marks.length === 0) {
      return ApiResponse.notFound("No marks found for this student").send(res);
    }

    return ApiResponse.success(marks, "Student marks retrieved successfully").send(res);
  } catch (error) {
    console.error("Error in getStudentMarksController:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  getAllMarksController,
  addMarksController,
  updateMarksController,
  deleteMarksController,
  addBulkMarksController,
  getStudentsWithMarksController,
  getStudentMarksController,
};
