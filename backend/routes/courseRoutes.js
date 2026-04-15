import { Router } from "express";
import { body, param } from "express-validator";

import {
  createCourse,
  deleteCourse,
  getCourseById,
  listCourses,
  updateCourse
} from "../controllers/courseController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

const courseValidationRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1500 })
    .withMessage("Description must be 1500 characters or fewer"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("instructor").trim().notEmpty().withMessage("Instructor is required"),
  body("type").isIn(["free", "paid"]).withMessage("Type must be free or paid"),
  body("price")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number or zero"),
  body("durationInHours")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Duration must be a positive number or zero"),
  body("thumbnailUrl")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),
  body("order")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Order must be zero or greater"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be true or false")
];

const courseIdValidation = [
  param("id").isMongoId().withMessage("Course id must be a valid MongoDB ObjectId")
];

router.get("/", asyncHandler(listCourses));
router.get("/:id", courseIdValidation, validateRequest, asyncHandler(getCourseById));
router.post("/", courseValidationRules, validateRequest, asyncHandler(createCourse));
router.put(
  "/:id",
  [...courseIdValidation, ...courseValidationRules],
  validateRequest,
  asyncHandler(updateCourse)
);
router.delete("/:id", courseIdValidation, validateRequest, asyncHandler(deleteCourse));

export default router;