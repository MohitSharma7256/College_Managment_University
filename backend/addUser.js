const adminDetails = require("./models/details/admin-details.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const addUser = async () => {
  try {
    await connectToMongo();

    // Check if user already exists
    const existingUser = await adminDetails.findOne({ email: "ms1361277@gmail.com" });
    
    if (existingUser) {
      console.log("User already exists with email: ms1361277@gmail.com");
      return;
    }

    const adminDetail = {
      employeeId: 1361277,
      firstName: "Mohit",
      lastName: "Sharma",
      email: "ms1361277@gmail.com",
      phone: "1234567890",
      profile: "",
      address: "123 College Street",
      city: "College City",
      state: "State",
      pincode: "123456",
      country: "India",
      gender: "male",
      dob: new Date("1990-01-01"),
      designation: "System Administrator",
      joiningDate: new Date(),
      salary: 50000,
      status: "active",
      isSuperAdmin: true,
      emergencyContact: {
        name: "Emergency Contact",
        relationship: "Spouse",
        phone: "9876543210",
      },
      bloodGroup: "O+",
      password: "mohit12345",
    };

    await adminDetails.create(adminDetail);

    console.log("\n=== New Admin User Added ===");
    console.log("Email: ms1361277@gmail.com");
    console.log("Password: mohit12345");
    console.log("User Type: Admin");
    console.log("===========================\n");
    console.log("User added successfully!");
  } catch (error) {
    console.error("Error while adding user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

addUser();
