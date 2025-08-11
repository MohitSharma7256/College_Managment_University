# College Management System - Setup Instructions

## Login Issue Fixed ✅

The "user not found" error has been resolved. A new admin user has been added to the database with the following credentials:

**Email:** ms1361277@gmail.com  
**Password:** mohit12345  
**User Type:** Admin

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/college-management-system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_API_LINK=http://localhost:3000
   ```

4. Make sure MongoDB is running on your system

5. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_APILINK=http://localhost:4000/api
   ```

4. Start the frontend application:
   ```bash
   npm start
   ```

### 3. Login Instructions

1. Open your browser and go to `http://localhost:3000`
2. Select "Admin" as the user type
3. Use the following credentials:
   - **Email:** ms1361277@gmail.com
   - **Password:** mohit12345

### 4. Available User Types

The system supports three types of users:

1. **Admin** - Full system access
2. **Faculty** - Faculty-specific features
3. **Student** - Student-specific features

### 5. Adding More Users

To add more users, you can:

1. Use the admin panel after logging in
2. Run the `checkAndAddUsers.js` script in the backend directory
3. Modify the script to add different user types

### 6. Troubleshooting

If you still get "user not found" error:

1. Make sure MongoDB is running
2. Check that the backend server is running on port 4000
3. Verify the `.env` files are properly configured
4. Ensure the frontend is pointing to the correct API URL

## Default Admin User (from seed data)

There's also a default admin user created by the seed script:
- **Email:** admin@gmail.com
- **Password:** admin123

## API Endpoints

- Admin Login: `POST /api/admin/login`
- Faculty Login: `POST /api/faculty/login`
- Student Login: `POST /api/student/login`

The system is now ready to use with the new user credentials!
