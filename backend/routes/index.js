import { Router } from "express";

import courseRoutes from "./courseRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/courses", courseRoutes);

export default router;