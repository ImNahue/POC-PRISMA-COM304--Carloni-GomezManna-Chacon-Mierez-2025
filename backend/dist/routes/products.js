"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const router = (0, express_1.Router)();
router.get('/', products_1.getProducts);
router.get('/:id', products_1.getProductById);
router.post('/', products_1.createProduct);
router.put('/:id', products_1.updateProduct);
router.delete('/:id', products_1.deleteProduct);
// Special queries
router.get('/category/:categoryId', products_1.getProductsByCategory);
router.get('/out-of-stock', products_1.getOutOfStockProducts);
router.get('/expensive', products_1.getExpensiveProducts);
// Bulk operations routes
router.post('/bulk-delete', products_1.bulkDeleteProducts);
exports.default = router;
//# sourceMappingURL=products.js.map