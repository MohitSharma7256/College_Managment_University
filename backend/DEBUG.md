# Debug Notes - College Management System

## Known Issues

### Backend Issues
1. **JWT Token Expiry**: Tokens expire after 1 hour, need to implement refresh tokens
2. **File Upload**: No file size limits implemented yet
3. **Error Handling**: Some endpoints don't have proper error handling
4. **Validation**: Missing input validation on some endpoints

### Frontend Issues
1. **Loading States**: Some components don't show loading states
2. **Error Boundaries**: No error boundaries implemented
3. **Form Validation**: Client-side validation is minimal
4. **Responsive Design**: Not fully responsive on mobile

## Debugging Tips

### Backend Debugging
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"

# Check environment variables
echo $MONGODB_URI
echo $JWT_SECRET

# Monitor logs
tail -f logs/app.log
```

### Frontend Debugging
```javascript
// Check localStorage
console.log(localStorage.getItem('userToken'));

// Check API responses
// Add this to axios interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Common Errors and Solutions

### 1. MongoDB Connection Error
**Error**: `MongoNetworkError: connect ECONNREFUSED`
**Solution**: Make sure MongoDB is running on the correct port

### 2. JWT Token Error
**Error**: `JsonWebTokenError: invalid token`
**Solution**: Check if JWT_SECRET is set correctly in .env

### 3. CORS Error
**Error**: `Access to fetch at 'http://localhost:4000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`
**Solution**: Check CORS configuration in backend

### 4. File Upload Error
**Error**: `MulterError: File too large`
**Solution**: Implement file size limits in multer configuration

## Performance Issues

### Database Queries
- Some queries don't use indexes properly
- Need to add compound indexes for search queries
- Consider implementing pagination for large datasets

### Frontend Performance
- Large bundle size due to unused dependencies
- No code splitting implemented
- Images not optimized

## Security Concerns

### High Priority
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Validate file uploads
- [ ] Add CSRF protection

### Medium Priority
- [ ] Implement proper session management
- [ ] Add audit logging
- [ ] Secure headers configuration

## Testing Notes

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Create new student/faculty/admin
- [ ] Update user details
- [ ] Delete user
- [ ] File upload functionality
- [ ] Search and filter functionality

### Automated Testing
- No unit tests implemented yet
- Need to add integration tests
- Consider adding E2E tests with Cypress

## Deployment Notes

### Environment Variables
Make sure these are set in production:
- MONGODB_URI
- JWT_SECRET
- NODEMAILER_EMAIL
- NODEMAILER_PASS
- FRONTEND_API_LINK

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure proper logging
- [ ] Set up monitoring
- [ ] Configure backup strategy
- [ ] Set up SSL certificates

## Personal Notes
- Remember to check for memory leaks in long-running processes
- Consider implementing health checks for production
- Need to discuss with team about scaling strategy
- Should probably add TypeScript for better type safety
