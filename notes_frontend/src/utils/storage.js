const NAMESPACE = 'ocean-notes';

/**
 * Safely parse JSON with default fallback.
 */
function safeParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Get a namespaced key for storage.
 */
function key(name) {
  return `${NAMESPACE}:${name}`;
}

/**
 * Read a value from localStorage.
 */
// PUBLIC_INTERFACE
export function storageGet(name, defaultValue) {
  const raw = window.localStorage.getItem(key(name));
  if (raw == null) return defaultValue;
  return safeParse(raw, defaultValue);
}

/**
 * Write a value to localStorage.
 */
// PUBLIC_INTERFACE
export function storageSet(name, value) {
  window.localStorage.setItem(key(name), JSON.stringify(value));
}

/**
 * Remove a value from localStorage.
 */
// PUBLIC_INTERFACE
export function storageRemove(name) {
  window.localStorage.removeItem(key(name));
}
