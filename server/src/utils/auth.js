// Minimal auth util for tests: generateToken returns the user id string.
// The server middleware will accept this token as the user id.

function generateToken(user) {
  if (!user) return null;
  // If user is a mongoose doc, get _id
  const id = user._id ? user._id.toString() : String(user);
  return id;
}

module.exports = { generateToken };
