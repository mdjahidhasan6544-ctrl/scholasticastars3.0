const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_URL is not configured. Point the frontend to your deployed backend URL before using the dashboard."
    );
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export const api = {
  getHealth() {
    return request("/api/health");
  },

  getCourses() {
    return request("/api/courses");
  },

  createCourse(course) {
    return request("/api/courses", {
      method: "POST",
      body: JSON.stringify(course)
    });
  },

  updateCourse(courseId, course) {
    return request(`/api/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(course)
    });
  },

  deleteCourse(courseId) {
    return request(`/api/courses/${courseId}`, {
      method: "DELETE"
    });
  }
};

export { API_BASE_URL };