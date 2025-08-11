# Postman Requests Guide for College Management System

## Setup Instructions

1. **Import the Collection**: Import `Postman_Collection.json` into Postman
2. **Set Environment Variables**:
   - `baseUrl`: `http://localhost:4000/api`
   - `token`: (will be set after login)
   - `branchId`: (will be set after creating a branch)

## Step-by-Step Process

### Step 1: Login to Get Token

**Admin Login**
```
POST {{baseUrl}}/admin/login
Content-Type: application/json

{
  "email": "ms1361277@gmail.com",
  "password": "mohit12345"
}
```

**Response**: Copy the `token` from the response and set it as the `token` environment variable.

### Step 2: Create Branch (Required for Faculty/Students)

**Create Branch**
```
POST {{baseUrl}}/branch
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "branchId": "CS001",
  "name": "Computer Science"
}
```

**Response**: Copy the `_id` from the response and set it as the `branchId` environment variable.

### Step 3: Add Users

## 1. Add New Admin

**Request Details:**
- **Method**: POST
- **URL**: `{{baseUrl}}/admin/register`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
- **Body**: Form-data

**Form Data:**
```
firstName: John
lastName: Doe
email: john.doe@college.com
phone: 9876543210
address: 123 College Street
city: Mumbai
state: Maharashtra
pincode: 400001
country: India
gender: male
dob: 1990-01-01
designation: System Administrator
joiningDate: 2023-01-01
salary: 50000
bloodGroup: O+
emergencyContact[name]: Jane Doe
emergencyContact[relationship]: Spouse
emergencyContact[phone]: 9876543211
file: [Upload profile image]
```

**Default Password**: `admin123`

---

## 2. Add New Faculty

**Request Details:**
- **Method**: POST
- **URL**: `{{baseUrl}}/faculty/register`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
- **Body**: Form-data

**Form Data:**
```
firstName: Dr. Sarah
lastName: Johnson
email: sarah.johnson@college.com
phone: 9876543212
address: 456 Faculty Avenue
city: Mumbai
state: Maharashtra
pincode: 400002
country: India
gender: female
dob: 1985-05-15
designation: Assistant Professor
joiningDate: 2022-06-01
salary: 45000
branchId: {{branchId}}
bloodGroup: A+
emergencyContact[name]: Mike Johnson
emergencyContact[relationship]: Husband
emergencyContact[phone]: 9876543213
file: [Upload profile image]
```

**Default Password**: `faculty123`

---

## 3. Add New Student

**Request Details:**
- **Method**: POST
- **URL**: `{{baseUrl}}/student/register`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
- **Body**: Form-data

**Form Data:**
```
firstName: Alex
middleName: Kumar
lastName: Singh
phone: 9876543214
semester: 3
branchId: {{branchId}}
gender: male
dob: 2002-08-20
address: 789 Student Lane
city: Mumbai
state: Maharashtra
pincode: 400003
country: India
bloodGroup: B+
emergencyContact[name]: Raj Singh
emergencyContact[relationship]: Father
emergencyContact[phone]: 9876543215
file: [Upload profile image]
```

**Note**: 
- Email is auto-generated as `{enrollmentNo}@gmail.com`
- Enrollment number is auto-generated
- **Default Password**: `student123`

---

## Quick Reference - Individual Requests

### Admin Registration (JSON Format)
```json
POST http://localhost:4000/api/admin/register
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: multipart/form-data

Body (form-data):
  firstName: John
  lastName: Doe
  email: john.doe@college.com
  phone: 9876543210
  address: 123 College Street
  city: Mumbai
  state: Maharashtra
  pincode: 400001
  country: India
  gender: male
  dob: 1990-01-01
  designation: System Administrator
  joiningDate: 2023-01-01
  salary: 50000
  bloodGroup: O+
  emergencyContact[name]: Jane Doe
  emergencyContact[relationship]: Spouse
  emergencyContact[phone]: 9876543211
  file: [profile_image.jpg]
```

### Faculty Registration (JSON Format)
```json
POST http://localhost:4000/api/faculty/register
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: multipart/form-data

Body (form-data):
  firstName: Dr. Sarah
  lastName: Johnson
  email: sarah.johnson@college.com
  phone: 9876543212
  address: 456 Faculty Avenue
  city: Mumbai
  state: Maharashtra
  pincode: 400002
  country: India
  gender: female
  dob: 1985-05-15
  designation: Assistant Professor
  joiningDate: 2022-06-01
  salary: 45000
  branchId: BRANCH_ID_HERE
  bloodGroup: A+
  emergencyContact[name]: Mike Johnson
  emergencyContact[relationship]: Husband
  emergencyContact[phone]: 9876543213
  file: [profile_image.jpg]
```

### Student Registration (JSON Format)
```json
POST http://localhost:4000/api/student/register
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: multipart/form-data

Body (form-data):
  firstName: Alex
  middleName: Kumar
  lastName: Singh
  phone: 9876543214
  semester: 3
  branchId: BRANCH_ID_HERE
  gender: male
  dob: 2002-08-20
  address: 789 Student Lane
  city: Mumbai
  state: Maharashtra
  pincode: 400003
  country: India
  bloodGroup: B+
  emergencyContact[name]: Raj Singh
  emergencyContact[relationship]: Father
  emergencyContact[phone]: 9876543215
  file: [profile_image.jpg]
```

## Important Notes

1. **Authentication**: All registration requests require a valid admin token
2. **Branch ID**: Faculty and Students require a valid branch ID
3. **File Upload**: Profile images are optional but recommended
4. **Default Passwords**:
   - Admin: `admin123`
   - Faculty: `faculty123`
   - Student: `student123`
5. **Email Generation**: Students get auto-generated emails based on enrollment number
6. **ID Generation**: Employee IDs and Enrollment numbers are auto-generated

## Testing the Requests

1. Start your backend server: `npm start` (port 4000)
2. Import the Postman collection
3. Set environment variables
4. Login to get token
5. Create a branch
6. Add users using the registration requests

## Response Format

All successful requests will return:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    // User details without password
  }
}
```
