const Branch = require("../models/branch.model");
const ApiResponse = require("../utils/ApiResponse");

// Get all branches with optional search
const getBranchController = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const branches = await Branch.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { branchId: { $regex: search, $options: "i" } },
      ],
    });

    if (!branches || branches.length === 0) {
      return ApiResponse.notFound("No branches found").send(res);
    }

    return ApiResponse.success(branches, "Branches found successfully!").send(res);
  } catch (error) {
    console.error("Get Branch Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Add new branch
const addBranchController = async (req, res, next) => {
  try {
    let { name, branchId } = req.body;

    // Check if branch already exists
    let existingBranch = await Branch.findOne({
      $or: [{ name }, { branchId }],
    });

    if (existingBranch) {
      return ApiResponse.conflict("Branch already exists").send(res);
    }

    const newBranch = await Branch.create(req.body);
    return ApiResponse.created(newBranch, "Branch added successfully!").send(res);
  } catch (error) {
    console.error("Add Branch Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Update branch details
const updateBranchController = async (req, res, next) => {
  try {
    const { name, branchId } = req.body;

    // Check if branch exists with same name/id
    const existingBranch = await Branch.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ name }, { branchId }] },
      ],
    });

    if (existingBranch) {
      return ApiResponse.conflict("Branch with this name or ID already exists").send(res);
    }

    let branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!branch) {
      return ApiResponse.notFound("Branch not found").send(res);
    }

    return ApiResponse.success(branch, "Branch updated successfully!").send(res);
  } catch (error) {
    console.error("Update Branch Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Delete branch - TODO: Add cascade delete for related data
const deleteBranchController = async (req, res, next) => {
  try {
    let branch = await Branch.findById(req.params.id);

    if (!branch) {
      return ApiResponse.notFound("Branch not found").send(res);
    }

    await Branch.findByIdAndDelete(req.params.id);
    return ApiResponse.success(null, "Branch Deleted Successfully!").send(res);
  } catch (error) {
    console.error("Delete Branch Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  getBranchController,
  addBranchController,
  updateBranchController,
  deleteBranchController,
};
