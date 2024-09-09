const express = require('express');
const { promptLibraryModel } = require('../model/promptLibrary.model');
const promptLibraryRouter = express.Router();

promptLibraryRouter.get("/", async (req, res) => {
    try {
        const { Title, Category } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const query = {};

        if (Title) {
            query.Title = { $regex: Title, $options: 'i' };
        }
        if (Category) {
            query.Category = Category;
        }
        const promptLibrary = await promptLibraryModel.paginate(query, {
            page,
            limit
        });

        res.status(200).json({
            promptLibrary: promptLibrary.docs,
            totalData: promptLibrary.totalDocs,
            pages: promptLibrary.totalPages,
            currentPage: promptLibrary.page
        });
    } catch (error) {
        res.status(500).json({ message: "Error getting Prompts", error });
    }
});

promptLibraryRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prompt = await promptLibraryModel.findById(id);

        if (!prompt) {
            return res.status(404).json({ message: "Prompt not found" });
        }

        res.status(200).json(prompt);
    } catch (error) {
        res.status(500).json({ message: "Error getting prompt by ID", });
    }
});

module.exports = {
    promptLibraryRouter
};
