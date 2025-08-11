// API Response utility class - helps standardize API responses
// TODO: Add more response types as needed
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  // Conflict response (409)
  static conflict(message = "Conflict") {
    return new ApiResponse(409, null, message);
  }

  // Success response (200)
  static success(data, message = "Success") {
    return new ApiResponse(200, data, message);
  }

  // Created response (201)
  static created(data, message = "Created successfully") {
    return new ApiResponse(201, data, message);
  }

  // No content response (204)
  static noContent(message = "No content") {
    return new ApiResponse(204, null, message);
  }

  // Bad request response (400)
  static badRequest(message = "Bad request") {
    return new ApiResponse(400, null, message);
  }

  // Unauthorized response (401)
  static unauthorized(message = "Unauthorized") {
    return new ApiResponse(401, null, message);
  }

  // Forbidden response (403)
  static forbidden(message = "Forbidden") {
    return new ApiResponse(403, null, message);
  }

  // Not found response (404)
  static notFound(message = "Not found") {
    return new ApiResponse(404, null, message);
  }

  // Internal server error (500)
  static internalServerError(message = "Internal server error") {
    return new ApiResponse(500, null, message);
  }

  // Custom error response
  static error(message = "Error", statusCode = 500) {
    return new ApiResponse(statusCode, null, message);
  }

  // Send response to client
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
