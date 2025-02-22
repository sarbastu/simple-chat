class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status || 500;
    this.error = message || 'Internal server error';
  }
}

export default AppError;
