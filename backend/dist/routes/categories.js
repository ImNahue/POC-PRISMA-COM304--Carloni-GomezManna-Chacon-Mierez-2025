"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = require("../controllers/categories");
const router = (0, express_1.Router)();
router.get('/', categories_1.getCategories);
router.get('/:id', categories_1.getCategoryById);
router.post('/', categories_1.createCategory);
router.post('/reset', categories_1.resetDatabase);
router.put('/:id', categories_1.updateCategory);
router.delete('/:id', categories_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map