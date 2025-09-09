//backend/dist/controllers/categories
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: { products: true }
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching category' });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await prisma.category.create({
            data: { name, description }
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
};
exports.createCategory = createCategory;
//# sourceMappingURL=categories.js.map