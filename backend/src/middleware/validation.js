// Validation middleware for issue creation
exports.validateIssue = (req, res, next) => {
  const { type, description, location, latitude, longitude } = req.body;

  const errors = [];

  if (!type || typeof type !== 'string' || type.trim().length === 0) {
    errors.push('Type is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters');
  }

  if (description && description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Location is required and must be a non-empty string');
  }

  if (latitude === undefined || latitude === null || isNaN(parseFloat(latitude))) {
    errors.push('Latitude is required and must be a valid number');
  }

  if (longitude === undefined || longitude === null || isNaN(parseFloat(longitude))) {
    errors.push('Longitude is required and must be a valid number');
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (lat < -90 || lat > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (lng < -180 || lng > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
