const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.isFriendly ? err.message : 'Something went wrong. Please try again.';

  res.status(statusCode).json({
    success: false,
    error: { message, status: statusCode },
  });
};

export default errorHandler;
