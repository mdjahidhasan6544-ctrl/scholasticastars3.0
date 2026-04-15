import { courseService } from "../services/courseService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";

export async function listCourses(req, res) {
  const publishedOnly = req.query.publishedOnly === "true";
  const courses = await courseService.listCourses({ publishedOnly });

  return sendSuccess(res, {
    message: "Courses fetched successfully",
    data: courses,
    meta: {
      count: courses.length,
      publishedOnly
    }
  });
}

export async function getCourseById(req, res) {
  const course = await courseService.getCourseById(req.params.id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return sendSuccess(res, {
    message: "Course fetched successfully",
    data: course
  });
}

export async function createCourse(req, res) {
  const course = await courseService.createCourse(req.body);

  return sendSuccess(
    res,
    {
      message: "Course created successfully",
      data: course
    },
    201
  );
}

export async function updateCourse(req, res) {
  const course = await courseService.updateCourse(req.params.id, req.body);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return sendSuccess(res, {
    message: "Course updated successfully",
    data: course
  });
}

export async function deleteCourse(req, res) {
  const deletedCourse = await courseService.deleteCourse(req.params.id);

  if (!deletedCourse) {
    throw new AppError("Course not found", 404);
  }

  return sendSuccess(res, {
    message: "Course deleted successfully",
    data: deletedCourse
  });
}