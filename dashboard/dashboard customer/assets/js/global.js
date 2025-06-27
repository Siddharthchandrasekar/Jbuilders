// global.js

// Function to set userId (only if it's not already set)
export function setUserId(id) {
  if (!localStorage.getItem("userId")) {
    localStorage.setItem("userId", id);
  }
}

// Function to get userId
export function getUserId() {
  return localStorage.getItem("userId");
}

// Function to clear userId on logout
export function clearUserId() {
  localStorage.removeItem("userId");
}
