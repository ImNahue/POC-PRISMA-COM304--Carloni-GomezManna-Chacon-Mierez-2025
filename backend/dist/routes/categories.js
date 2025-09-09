"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = require("../controllers/categories");
const router = (0, express_1.Router)();
router.get('/', categories_1.getCategories);
router.get('/:id', categories_1.getCategoryById);
router.post('/', categories_1.createCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map