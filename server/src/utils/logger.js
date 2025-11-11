// Minimal logger abstraction to allow swapping implementations later
function error(msg) {
  // In production this could be replaced with winston or pino
  // For tests we keep it simple
  // eslint-disable-next-line no-console
  console.error(msg);
}

module.exports = { error };
