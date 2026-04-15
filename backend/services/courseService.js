import { Course } from "../models/Course.js";

function toNonNegativeNumber(value, fallback = 0) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return fallback;
  }

  return parsedValue;
}

function sanitizeCoursePayload(payload) {
  const normalized = {
    ...payload
  };

  normalized.price = toNonNegativeNumber(normalized.price, 0);
  normalized.durationInHours = toNonNegativeNumber(normalized.durationInHours, 0);
  normalized.order = toNonNegativeNumber(normalized.order, 0);

  if (normalized.type === "free") {
    normalized.price = 0;
  }

  return normalized;
}

export const courseService = {
  async listCourses({ publishedOnly = false } = {}) {
    const query = publishedOnly ? { isPublished: true } : {};

    return Course.find(query).sort({ order: 1, createdAt: -1 }).lean();
  },

  async getCourseById(courseId) {
    return Course.findById(courseId).lean();
  },

  async createCourse(payload) {
    const course = await Course.create(sanitizeCoursePayload(payload));
    return course.toObject();
  },

  async updateCourse(courseId, payload) {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, sanitizeCoursePayload(payload), {
      new: true,
      runValidators: true
    });

    return updatedCourse ? updatedCourse.toObject() : null;
  },

  async deleteCourse(courseId) {
    const course = await Course.findById(courseId);

    if (!course) {
      return null;
    }

    const serialized = course.toObject();
    await course.deleteOne();
    return serialized;
  }
};