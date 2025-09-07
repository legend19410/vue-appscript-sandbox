// Transform response middleware
function responseWrapperMiddleware(params, next) {
  const result = next(params);
  return JSON.stringify({ ...JSON.parse(result), timestamp: new Date().toISOString() });
}


