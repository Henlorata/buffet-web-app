import { Router } from "express";
import {
  getCategories, getProducts, createProduct, updateProduct, createCategory, updateCategory, deleteCategory,
  toggleFavorite
} from "../controllers/ProductController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", requireAuth, createCategory);
router.put("/categories/:id", requireAuth, updateCategory);
router.delete("/categories/:id", requireAuth, deleteCategory);
router.post("/:id/favorite", requireAuth, toggleFavorite);

router.get("/", getProducts);
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);

export default router;