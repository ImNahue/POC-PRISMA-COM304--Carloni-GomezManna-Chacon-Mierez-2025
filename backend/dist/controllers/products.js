"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensiveProducts = exports.getOutOfStockProducts = exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = async (req, res) => {
    const { category, minPrice, maxPrice, inStock } = req.query;
    const filters = {};
    if (category)
        filters.categoryId = parseInt(category);
    if (minPrice)
        filters.price = { gte: parseFloat(minPrice) };
    if (maxPrice)
        filters.price = { ...filters.price, lte: parseFloat(maxPrice) };
    if (inStock === 'true')
        filters.stock = { gt: 0 };
    try {
        const products = await prisma.product.findMany({
            where: filters,
            include: { category: true }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { category: true }
        });
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ error: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId: parseInt(categoryId)
            },
            include: { category: true }
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId: parseInt(categoryId)
            },
            include: { category: true }
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};
exports.deleteProduct = deleteProduct;
// Special queries
const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: { categoryId: parseInt(categoryId) },
            include: { category: true }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching products by category' });
    }
};
exports.getProductsByCategory = getProductsByCategory;
const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { stock: { equals: 0 } },
            include: { category: true }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching out of stock products' });
    }
};
exports.getOutOfStockProducts = getOutOfStockProducts;
const getExpensiveProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { price: { gt: 100 } }, // Products more expensive than 100
            include: { category: true },
            orderBy: { price: 'desc' }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching expensive products' });
    }
};
exports.getExpensiveProducts = getExpensiveProducts;
//# sourceMappingURL=products.js.map