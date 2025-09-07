// Logging middleware
function logMiddleware(params, next) {
  console.log("📥 Request received:", params);
  const result = next(params);
  console.log("📤 Response generated:", result);
  return result;
}