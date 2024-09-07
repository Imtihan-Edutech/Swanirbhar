const express = require('express');
const { promptLibraryModel } = require('../model/promptLibrary.model');
const promptLibraryRouter = express.Router();

promptLibraryRouter.get("/", async (req, res) => {
    try {
        const { title, category, page = 1, limit = 100 } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        };

        const promptLibrary = await promptLibraryModel.paginate(query,options);
        res.status(200).json({
            promptLibrary: promptLibrary.docs,
            totalData: promptLibrary.totalDocs,
            pages: promptLibrary.totalPages
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting Prompts" });
    }
})


module.exports = {
    promptLibraryRouter
}