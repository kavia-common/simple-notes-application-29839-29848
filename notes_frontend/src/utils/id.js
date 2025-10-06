function randSegment() {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Generate a compact unique id.
 */
// PUBLIC_INTERFACE
export function newId() {
  return `${Date.now().toString(36)}-${randSegment()}`;
}
