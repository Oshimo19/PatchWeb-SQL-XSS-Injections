// frontend/my-app/src/utils/safe-url-decode.js

export function isPathValid(path) {
  try {
    decodeURIComponent(path);
    return true;
  } catch {
    return false; // URL malformée => 404
  }
}
