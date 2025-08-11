const adminDetails = require("./models/details/admin-details.model");
const facultyDetails = require("./models/details/faculty-details.model");
const studentDetails = require("./models/details/student-details.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const checkAndAddUsers = async () => {
  try {
    await connectToMongo();

    console.log("=== Checking Existing Users ===\n");

    // Check existing admin users
    const existingAdmins = await adminDetails.find({});
    console.log(`Admin users found: ${existingAdmins.length}`);
    existingAdmins.forEach(admin => {
      console.log(`- ${admin.email} (${admin.firstName} ${admin.lastName})`);
    });

    // Check existing faculty users
    const existingFaculty = await facultyDetails.find({});
    console.log(`\nFaculty users found: ${existingFaculty.length}`);
    existingFaculty.forEach(faculty => {
      console.log(`- ${faculty.email} (${faculty.firstName} ${faculty.lastName})`);
    });

    // Check existing student users
    const existingStudents = await studentDetails.find({});
    console.log(`\nStudent users found: ${existingStudents.length}`);
    existingStudents.forEach(student => {
      console.log(`- ${student.email} (${student.firstName} ${student.lastName})`);
    });

    console.log("\n=== Adding New User ===\n");

    // Check if the new user already exists in any collection
    const email = "ms1361277@gmail.com";
    const existingAdmin = await adminDetails.findOne({ email });
    const existingFacultyUser = await facultyDetails.findOne({ email });
    const existingStudentUser = await studentDetails.findOne({ email });

    if (existingAdmin || existingFacultyUser || existingStudentUser) {
      console.log(`User with email ${email} already exists!`);
      if (existingAdmin) console.log("Found in Admin collection");
      if (existingFacultyUser) console.log("Found in Faculty collection");
      if (existingStudentUser) console.log("Found in Student collection");
      return;
    }

    // Add as Admin user
    const adminDetail = {
      employeeId: 1361277,
      firstName: "Mohit",
      lastName: "Sharma",
      email: email,
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

    console.log("✅ New Admin User Added Successfully!");
    console.log(`Email: ${email}`);
    console.log("Password: mohit12345");
    console.log("User Type: Admin");
    console.log("\nYou can now login with these credentials!");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

checkAndAddUsers();
