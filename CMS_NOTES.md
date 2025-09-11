## College Management System – Deep-Dive Notes (Architecture, Types, Features, Q&A)

These notes explain how the project works end-to-end: architecture, data model types, major features, important implementation details, default credentials, and interview-style questions with answers.

### Overview
- MERN stack application with three roles: Admin, Faculty, Student
- Backend: Node.js + Express + MongoDB (Mongoose), JWT auth, Multer (Cloudinary), Nodemailer
- Frontend: React 18 + Redux + React Router, Axios, Tailwind classes

### Repository structure (high-level)
- `backend/`: Express app, routes, controllers, Mongoose models, middlewares, utilities
- `frontend/`: React app, screens per role, Redux store/actions/reducers, Axios wrapper
- `PROJECT_NOTES.md`, `README.md`, `SETUP_INSTRUCTIONS.md`: Setup and technical guides

### Environment configuration
- Backend `.env` keys (required):
  - `MONGODB_URI`, `PORT`, `FRONTEND_API_LINK`
  - `JWT_SECRET`
  - `NODEMAILER_EMAIL`, `NODEMAILER_PASS`
  - `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- Frontend `.env` keys:
  - `REACT_APP_APILINK`, `REACT_APP_MEDIA_LINK`

### Authentication flow
1) User selects role on `/login` (Student | Faculty | Admin)
2) Submits `{ email, password }` to role-based endpoint: `/api/{role}/login`
3) Backend returns JWT; frontend stores token in `localStorage` and Redux
4) Protected requests include `Authorization: Bearer <token>`
5) Password reset: `POST /api/{role}/forget-password` → email link → `POST /api/{role}/update-password/:resetId`

### Data models and types (MongoDB via Mongoose)
- `Branch`: `{ branchId: String(unique), name: String(unique) }`
- `Subject`: `{ name: String, code: String, branch: ObjectId(Branch), semester: Number, credits: Number }`
- `Notice`: `{ title: String, description: String, type: enum(student|faculty|both), link?: String, createdAt: Date }`
- `Timetable`: `{ link: String(filename), branch: ObjectId(Branch), semester: Number }`
- `Material`: `{ title: String, subject: ObjectId(Subject), faculty: ObjectId(FacultyDetail), file: String(filename), semester: Number, branch: ObjectId(Branch), type: enum(notes|assignment|syllabus|other) }`
- `Exam`: `{ name: String, date: Date, semester: Number, examType: enum(mid|end), timetableLink?: String(filename), totalMarks: Number }`
- `Marks`: `{ studentId: ObjectId(StudentDetail), subjectId: ObjectId(Subject), marksObtained: Number, semester: Number, examId: ObjectId(Exam) }`
- `AdminDetail`: rich profile fields + `employeeId: Number`, `password: String (hashed)`
- `FacultyDetail`: rich profile + `employeeId: Number`, `branchId: ObjectId(Branch)`, `password: String (hashed)`
- `StudentDetail`: rich profile + `enrollmentNo: Number`, `branchId: ObjectId(Branch)`, `semester: Number`, `password: String (hashed)`
- `ResetPassword`: `{ userId: ObjectId, type: enum(AdminDetails|FacultyDetails|StudentDetails), resetToken: String(JWT) }`

Password hashing is done using Mongoose pre-save hooks in the detail models.

### Backend components
- `index.js`: bootstraps Express, CORS, JSON parsing, static `/media`, mounts `/api` routes
- `middlewares/auth.middleware.js`: verifies JWT from `Authorization` header, sets `req.userId`
- `middlewares/multer.middleware.js`: CloudinaryStorage config and file constraints
- `utils/ApiResponse.js`: `{ success, message, data }` wrapper
- `utils/SendMail.js`: sends reset emails using Nodemailer
- `routes/*` and `controllers/*`: feature-aligned endpoints and business logic

### Frontend components
- Entry: `src/index.js`, `src/App.jsx`
- Axios base URL: `src/baseUrl.js`; `src/utils/AxiosWrapper.js` with response interceptor to clear token on invalid/expired
- Redux: `src/redux/{actions.js, reducers.js, store.js}` for `userData`, `userToken`
- Screens:
  - Admin: manage Admins, Faculty, Students, Branch, Subject, Notice, Exam, Timetable
  - Faculty: Materials, Timetable, StudentFinder, AddMarks, Profile
  - Student: Timetable, Material, Notice, ViewMarks, Profile

### Key features
- Role-based login, JWT-protected APIs
- CRUD: Admin, Faculty, Student, Branch, Subject, Notice, Exam
- Timetable upload/update per `(branch, semester)`
- Materials upload (notes/assignments/syllabus/other) by faculty with ownership rules
- Marks management with duplication prevention and bulk add
- Password change and reset flows

### Important implementation details
- Default passwords on create (server controllers and UI toasts mention):
  - Admin: `admin123`
  - Faculty: `faculty123`
  - Student: `student123`
- File uploads go to Cloudinary via Multer; filenames are persisted in MongoDB
- CORS restricted to `FRONTEND_API_LINK` to prevent unwanted origins
- ApiResponse standardizes success, message, and data payloads

### Known gaps and improvements
- Add rate limiting for auth and general endpoints
- Introduce refresh tokens and logout/blacklist
- Stronger validations (schema-level uniques, marks range checks, cascade behaviors)
- Unify media handling (Cloudinary vs local `/media` serving)
- Admin dashboard statistics and safer admin deletion rules
- Replace Gmail with transactional email provider; use app passwords

### Setup and run
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm start`
- Ensure both `.env` files are created and MongoDB is running; configure Cloudinary + Nodemailer if using uploads/emails

### Default login IDs and passwords (from code/docs)
- Seeded Admin (see `backend/seedData.js` and docs):
  - Email: `ms1361277@gmail.com`
  - Password: `Mohit@123`
- Default passwords assigned on creation:
  - Admin: `admin123`
  - Faculty: `faculty123`
  - Student: `student123`

Note: Faculty/Student emails are created/entered at registration time (e.g., student email may be generated as `{enrollmentNo}@gmail.com` per guide). If you forget a password, use the Forget Password flow.

### Interview questions and answers
1) What auth strategy is used and where is it enforced?
   - JWT-based. Tokens are issued on login and checked by `middlewares/auth.middleware.js`, which reads `Authorization: Bearer <token>` and sets `req.userId`.

2) How are passwords stored and reset?
   - Stored as hashed values via Mongoose pre-save hooks. Reset is via JWT reset token stored in `ResetPassword` and emailed with Nodemailer; frontend posts new password using `resetId`.

3) How are files handled?
   - Multer with CloudinaryStorage. Uploaded files (profile images, materials, timetables) store the resulting filename in MongoDB, and are accessed via configured media links.

4) How are roles separated in the API?
   - Each role has dedicated endpoints under `/api/admin`, `/api/faculty`, `/api/student` for login, details, and management features, with the same JWT middleware for protection.

5) How does the frontend persist auth state?
   - Token is stored in `localStorage` and Redux; Axios interceptor logs the user out on invalid/expired token responses.

6) What prevents duplicate marks entries?
   - The marks controller checks for existing records by `(studentId, subjectId, examId)` and rejects duplicates.

7) How does timetable upsert work?
   - Create/update is keyed by `(branch, semester)`. If a timetable exists, updates occur instead of creating a duplicate.

8) What are common improvements to productionize this system?
   - Rate limiting, refresh tokens, audit logs, robust validation, pagination/sorting, transactional email service, and CI/testing.

9) How is CORS configured?
   - Allowed origin is restricted to `FRONTEND_API_LINK` from the backend `.env`.

10) Where are default credentials defined?
    - In controllers (e.g., student/faculty create set `student123`/`faculty123`) and docs/UI toasts. Seed script includes `admin@gmail.com` with `admin123`.

11) How would you add fine-grained permissions?
    - Introduce RBAC: roles/permissions tables, attach claims in JWT, and add route-level guards checking permissions beyond simple authentication.

12) How does password change differ from reset?
    - Change requires a logged-in user and current password; reset uses emailed token without being logged in.

13) Where would you enforce unique constraints (e.g., email)?
    - At Mongoose schema level with `unique: true` (plus proper indexing), and again in controllers for defensive checks.

14) How do you avoid exposing raw Cloudinary URLs publicly?
    - Use signed URLs or proxy through backend; store only references/IDs and generate short-lived links when needed.

15) How is error handling standardized?
    - Controllers return `ApiResponse` with consistent `{ success, message, data }` and HTTP status codes; middleware handles auth errors uniformly.

### Troubleshooting tips
- Invalid/expired token: login again; interceptor will redirect to `/`
- Upload errors: verify Cloudinary `.env` values and file format constraints
- Email not sent: use Gmail app password or a transactional provider; check SMTP logs
- Mongo connection issues: verify `MONGODB_URI` and that the service is running

---
Use this NOTES file alongside `PROJECT_NOTES.md` for a comprehensive understanding of code, types, and flows.


