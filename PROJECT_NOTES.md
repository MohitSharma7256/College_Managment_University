# College Management System – Technical Overview and Feature Guide

A MERN-stack application for managing a college’s core operations across three roles: Admin, Faculty, and Student. This document explains the architecture, data models, APIs, and user flows implemented in the repository.

Repository structure (top-level):
- backend/ – Node.js + Express + MongoDB (Mongoose)
- frontend/ – React + Redux + React Router (CRA)
- Postman_Collection.json – API examples
- README.md, SETUP_INSTRUCTIONS.md – Quick start and environment setup


## 1) High-level Architecture

- Stack: MERN
  - Backend: Node.js, Express.js, Mongoose, JWT, Multer (Cloudinary storage), Nodemailer
  - Frontend: React 18, Redux, React Router DOM, Axios, Tailwind (classes used)
  - Database: MongoDB
- Auth: JWT-based. Token is issued on login and must be supplied as Authorization: Bearer <token> for protected routes.
- File Uploads: Via Multer using Cloudinary storage. The backend stores the uploaded asset’s filename in MongoDB.
- Email: Nodemailer (Gmail) to send password reset links.
- Static Media: Express serves /media from backend/media, though uploads are configured for Cloudinary.
- CORS: Restricted to FRONTEND_API_LINK defined in backend .env.


## 2) Environment variables

Backend (.env):
- MONGODB_URI=mongodb://127.0.0.1:27017/College-Management-System
- PORT=4000
- FRONTEND_API_LINK=http://localhost:3000
- JWT_SECRET=your-secret
- NODEMAILER_EMAIL=your-gmail-address
- NODEMAILER_PASS=your-gmail-app-password
- CLOUD_NAME=your-cloudinary-cloud
- API_KEY=your-cloudinary-key
- API_SECRET=your-cloudinary-secret

Frontend (.env):
- REACT_APP_APILINK=http://localhost:4000/api
- REACT_APP_MEDIA_LINK=http://localhost:4000/media


## 3) Backend overview

Entry points:
- index.js – Express app bootstrap, CORS, JSON parsing, static media, and routes registration.
- database/db.js – Mongoose connection.

Key folders:
- controllers/ – Route handlers implementing business logic
- models/ – Mongoose schemas
- routes/ – Express route definitions per feature
- middlewares/ – auth (JWT) and multer (Cloudinary) middleware
- utils/ – ApiResponse wrapper and mail sender

Common response format (via utils/ApiResponse):
- success (boolean)
- message (string)
- data (any)
- status code is set via res.status(...)

Authentication middleware (middlewares/auth.middleware.js):
- Expects Authorization header
- Accepts both raw token and Bearer <token>
- Verifies JWT using JWT_SECRET
- Assigns req.userId on success
- Standardized 401 on invalid/expired

File upload (middlewares/multer.middleware.js):
- CloudinaryStorage
- folder: cms_uploads
- allowed formats: jpg, jpeg, png, webp
- basic resize/quality transformation set on upload

Email (utils/SendMail.js):
- Sends a password reset email with a link to the frontend: {FRONTEND_API_LINK}/{type}/update-password/{resetId}
- type ∈ {admin, faculty, student}
- Backend expects the frontend to call back the update-password API with the resetId


## 4) Data models (MongoDB)

- Branch (models/branch.model.js)
  - branchId: String (unique)
  - name: String (unique)

- Subject (models/subject.model.js)
  - name: String
  - code: String
  - branch: ObjectId → Branch
  - semester: Number
  - credits: Number

- Notice (models/notice.model.js)
  - title: String
  - description: String
  - type: enum [student, faculty, both]
  - link: String (optional)
  - createdAt: Date (default now)

- Timetable (models/timetable.model.js)
  - link: String (uploaded file’s filename)
  - branch: ObjectId → Branch
  - semester: Number

- Material (models/material.model.js)
  - title: String
  - subject: ObjectId → Subject
  - faculty: ObjectId → FacultyDetail
  - file: String (uploaded file’s filename)
  - semester: Number
  - branch: ObjectId → Branch
  - type: enum [notes, assignment, syllabus, other]

- Exam (models/exam.model.js)
  - name: String
  - date: Date
  - semester: Number
  - examType: enum [mid, end]
  - timetableLink: String (uploaded file’s filename)
  - totalMarks: Number

- Marks (models/marks.model.js)
  - studentId: ObjectId → StudentDetail
  - subjectId: ObjectId → Subject
  - marksObtained: Number
  - semester: Number
  - examId: ObjectId → Exam

- AdminDetail (models/details/admin-details.model.js)
  - employeeId: Number
  - firstName, lastName, email, phone, profile
  - address, city, state, pincode, country
  - gender: enum [male, female, other]
  - dob: Date
  - designation, joiningDate, salary
  - status: enum [active, inactive] (default active)
  - isSuperAdmin: Boolean (default false)
  - emergencyContact: { name, relationship, phone }
  - bloodGroup: enum
  - password: String (hashed via pre-save hook)

- FacultyDetail (models/details/faculty-details.model.js)
  - employeeId: Number
  - firstName, lastName, email, phone, profile
  - address, city, state, pincode, country
  - gender: enum [male, female, other]
  - dob: Date
  - designation, joiningDate, salary
  - status: enum [active, inactive]
  - emergencyContact, bloodGroup
  - branchId: ObjectId → Branch
  - password: String (hashed via pre-save hook)

- StudentDetail (models/details/student-details.model.js)
  - enrollmentNo: Number
  - firstName, middleName, lastName, email, phone, profile
  - semester: Number
  - branchId: ObjectId → Branch
  - gender: enum [male, female, other]
  - dob: Date
  - address, city, state, pincode, country
  - status, bloodGroup, emergencyContact
  - password: String (hashed via pre-save hook)

- ResetPassword (models/reset-password.model.js)
  - userId: ObjectId (polymorphic via refPath: type)
  - type: enum [AdminDetails, FacultyDetails, StudentDetails]
  - resetToken: String (JWT string stored)


## 5) REST API surface (backend)

All routes are mounted under /api in index.js. All listed routes (unless noted) require Authorization: Bearer <token>.

Authentication/Details (Admin) – /api/admin
- POST /register – multipart/form-data (file: profile image); creates admin with default password "admin123"
- POST /login – { email, password } → returns { token }
- GET /my-details – current admin details
- GET / – list all admins
- PATCH /:id – update admin (multipart/form-data allowed for profile)
- DELETE /:id – delete admin
- POST /forget-password – send reset email
- POST /update-password/:resetId – update password via reset link
- POST /change-password – change password when logged in

Authentication/Details (Faculty) – /api/faculty
- POST /register – multipart/form-data; default password "faculty123"
- POST /login – { email, password } → returns { token }
- GET /my-details
- GET / – list all faculty
- PATCH /:id – update faculty (multipart)
- DELETE /:id – delete faculty
- POST /forget-password – send reset email
- POST /update-password/:resetId – update password via reset link
- POST /change-password – change password when logged in

Authentication/Details (Student) – /api/student
- POST /register – multipart/form-data; default password "student123"
- POST /login – { email, password } → returns { token }
- GET /my-details – includes populated branchId
- GET / – list all students
- PATCH /:id – update student (multipart)
- DELETE /:id – delete student
- POST /forget-password – send reset email
- POST /update-password/:resetId – update password via reset link
- POST /change-password – change password when logged in
- POST /search – search by enrollment/name/semester/branch

Branch – /api/branch
- GET / – list branches (optional query: ?search=)
- POST / – add branch
- PATCH /:id – update branch
- DELETE /:id – delete branch

Subject – /api/subject
- GET / – list subjects (optional query: ?branch=&semester=)
- POST / – add subject
- PUT /:id – update subject
- DELETE /:id – delete subject

Notice – /api/notice
- GET / – list notices
- POST / – add notice
- PUT /:id – update notice
- DELETE /:id – delete notice

Timetable – /api/timetable
- GET / – list timetables (optional query: ?branch=&semester=)
- POST / – multipart/form-data with file (required); add or upsert by (branch, semester)
- PUT /:id – multipart/form-data; update timetable
- DELETE /:id – delete timetable

Material – /api/material
- GET / – list materials (optional query: subject, faculty, semester, branch, type)
- POST / – multipart/form-data with file; faculty from req.userId
- PUT /:id – multipart/form-data; only owner faculty can update
- DELETE /:id – only owner faculty can delete

Exam – /api/exam
- GET / – list exams (optional query: ?examType=&semester=)
- POST / – create exam; accepts optional file (timetableLink)
- PATCH /:id – update exam; accepts optional file
- DELETE /:id – delete exam

Marks – /api/marks
- GET / – list marks (optional query: ?studentId=&subjectId=&examId=)
- GET /students – get students with marks filtered by ?examId=&subjectId= (populated details)
- GET /student – intended to fetch marks for the current student or by filter; see "Known gaps" below
- POST / – add marks (conflict if already exist for student+subject+exam)
- POST /bulk – add marks in bulk (returns summary of successes/errors)
- DELETE /:id – delete marks

Notes:
- All controllers respond with ApiResponse wrapper (success flag, message, data).
- Upload fields for files use key name "file".


## 6) Frontend overview

Entry:
- src/index.js, src/App.jsx – Router and screen composition
- src/baseUrl.js – returns REACT_APP_APILINK for Axios
- src/utils/AxiosWrapper.js – Axios instance with baseURL + response interceptor
  - On token invalid/expired message, clears localStorage and redirects to "/"

State management (Redux):
- src/redux/action.js – action type constants
- src/redux/actions.js – setUserData, setUserToken
- src/redux/reducers.js – stores userData and userToken
- src/redux/store.js – Redux store (not shown above, lives in repo)

Authentication (src/Screens/Login.jsx):
- User selects type: Student | Faculty | Admin
- Calls endpoint: /student/login | /faculty/login | /admin/login
- Saves token in localStorage (userToken) and userType, dispatches setUserToken
- Redirects to /student, /faculty, or /admin based on type

Screens (selected):
- Admin area (src/Screens/Admin)
  - Home.jsx – menu to navigate: Home(Profile), Student, Faculty, Branch, Notice, Exam, Subjects, Admin
  - Admin.jsx – full CRUD for admins; default password admin123 on create
  - Branch.jsx, Subject.jsx, Faculty.jsx, Student.jsx – CRUD flows (see repo)
- Faculty area (src/Screens/Faculty)
  - Home.jsx – menu includes Timetable, Material, StudentFinder, Profile, etc.
  - AddMarks.jsx – add marks to students, Timetable.jsx/Material.jsx – upload and manage
- Student area (src/Screens/Student)
  - Home.jsx – menu: Timetable, Material, Notice, Exam, Marks
  - ViewMarks.jsx – fetches and displays marks (mid/end) with semester selector
  - Profile.jsx – shows logged-in student profile (branch populated)

Common UI components:
- Navbar.jsx, Heading.jsx, CustomButton.jsx, Loading.jsx, NoData.jsx, DeleteConfirm.jsx
- Toast notifications via react-hot-toast
- Icons via react-icons


## 7) Core user flows

Login (all roles):
1) User selects role on /login
2) Submit email + password to role-specific /login
3) On success, store JWT in localStorage, navigate to respective dashboard

Password reset (all roles):
1) Submit email to POST /{role}/forget-password
2) Email sent with link to frontend: /{role}/update-password/{resetId}
3) Frontend collects new password and calls POST /{role}/update-password/:resetId
4) Backend verifies reset token (10 min expiry), updates password, and deletes resets for that user

Timetable upload:
1) Admin/Faculty uploads a file via POST /timetable with branch + semester + file
2) If a timetable for the same (branch, semester) exists, it’s updated instead of duplicated
3) Students and faculty can list/view via GET /timetable?branch=&semester=

Materials upload (Faculty):
1) Faculty uploads notes/assignment/syllabus via POST /material (title, subject, semester, branch, type, file)
2) Only the uploading faculty can update/delete their material
3) Students filter and view materials by subject/semester/type/branch

Marks:
1) Faculty adds marks via POST /marks (studentId, subjectId, examId, marksObtained, semester)
2) Prevents duplicates for the same student+subject+exam
3) Students can view their marks split by exam type (mid/end)


## 8) Security and validations

- JWT-based auth; middleware handles Bearer token parsing and token expiry errors
- Passwords are hashed on save in Mongoose pre-save hooks
- Controllers validate email format, phone length, and some field presence
- CORS restricts origin to FRONTEND_API_LINK
- File uploads limited to common image formats in middleware (notes: exam/timetable may be better suited to PDFs; see improvements)


## 9) Known gaps and improvements (as seen in code/TODOs)

- Rate limiting (login, general API) – TODO noted in code
- Refresh tokens – tokens currently set to 1h expiry (admin controller comment)
- Cascade deletes – e.g., deleting a branch should consider dependent data
- Validations – e.g., marks range validation in bulk add (TODO), stronger model-level validation, email uniqueness constraints at schema level
- Default passwords – admin123/faculty123/student123 on create; consider forcing password reset on first login
- Nodemailer config – use app passwords/relay; avoid plain credentials
- Cloudinary vs local media – code serves /media locally but storage uses Cloudinary; standardize access URLs and stored fields
- Admin dashboard stats – getAdminDashboardStats is stubbed
- Deleting last admin – bulk delete has TODO to prevent removing last admin
- Marks endpoint shape – GET /api/marks/student route does not currently accept a :studentId param, while controller getStudentMarksController expects req.params.studentId and Student ViewMarks queries by semester via query string. Confirm and align route/controller (either add :studentId or tailor controller to use req.userId + optional ?semester= filter).
- Seeding scripts – README mentions npm run seed (admin-seeder.js) but repo contains seedData.js; confirm and align scripts.


## 10) Running the system

Quick start (see README.md / SETUP_INSTRUCTIONS.md for details):
- Backend: cd backend && npm install && npm run dev
- Frontend: cd frontend && npm install && npm start
- Ensure .env files are created in both backend and frontend
- Ensure MongoDB is running, Cloudinary credentials are valid if you intend to upload files, and Nodemailer credentials are set for reset emails


## 11) Feature matrix (by role)

Admin
- Manage Admins (CRUD), default password assign on creation
- Manage Faculty (CRUD)
- Manage Students (CRUD)
- Manage Branches (CRUD)
- Manage Subjects (CRUD)
- Manage Notices (CRUD)
- Manage Timetables (upload/update by branch+semester)
- Manage Exams (create/update/delete with timetable file)
- Profile and password change

Faculty
- Profile and password change
- Upload and manage Materials (notes/assignments/syllabus/other)
- Upload/Manage Timetables (if allowed by UI)
- Search students (by enrollment/name/semester/branch)
- Add/Update/Delete Marks (including bulk add)
- View Notices

Student
- Profile view
- View Timetables (by branch+semester)
- View Materials (filter by subject/semester/type/branch)
- View Notices
- View Marks (mid vs end), choose semester
- Password change/reset


## 12) API request/response sample

Example: Admin login
- POST /api/admin/login
- Body: { "email": "admin@gmail.com", "password": "admin123" }
- Success response:
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "<jwt>" }
}

All subsequent protected API calls must include header:
Authorization: Bearer <jwt>


## 13) Extensibility suggestions

- Add RBAC/permissions per route (e.g., Admin-only routes, Faculty restrictions)
- Add pagination, sorting, and query filters consistently across list endpoints
- Add audit logs (who did what and when)
- Replace Gmail with a transactional email provider (resilience + deliverability)
- Support document/PDF uploads for materials/exams/timetables
- Unified file abstraction with signed URLs when using Cloudinary
- Add refresh tokens and logout/blacklist mechanics
- Improve frontend error boundaries and loading states
- Introduce E2E/API tests and CI pipeline


This document summarizes how the project is structured and how its features work across the stack. Use it alongside README.md and SETUP_INSTRUCTIONS.md when setting up or extending the system.



<!-- seedData.js
 ✅
Role: Production system initialization
Creates: Default admin (ms1361277@gmail.com / Mohit@123)
Status: Fixed with proper password hashing -->