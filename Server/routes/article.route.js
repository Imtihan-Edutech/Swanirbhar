const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const path = require("path");
const multer = require("multer");
const { diskStorage } = require("../middleware/upload.middleware");
const { userModel } = require("../model/user.model");
const { articleModel } = require("../model/article.model");

const articleRouter = express.Router();

const baseDir = path.join(__dirname, '../uploads');
const upload = multer({ storage: diskStorage(baseDir, { coverImage: 'articleImages' }) });

articleRouter.get("/", async (req, res) => {
    try {
        const { title, category, createdBy } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (createdBy) {
            const users = await userModel.find(
                { fullName: { $regex: createdBy, $options: 'i' } },
            );
            const userIds = users.map(user => user._id);
            query.createdBy = { $in: userIds };
        }

        const options = {
            populate: [{ path: 'createdBy', select: 'fullName profilePic' }],
        };

        const articles = await articleModel.paginate(query, options);

        res.status(200).json({
            articles: articles.docs,
            totalData: articles.totalDocs,
            pages: articles.totalPages
        });

    } catch (error) {
        res.status(500).json({ message: "Error getting Articles" });
    }
})

articleRouter.post("/", auth, upload.single('coverImage'), async (req, res) => {
    const { title, category, content, description } = req.body;
    try {
        const coverImage = req.file ? req.file.filename : undefined;

        const articleDetails = new articleModel({
            title,
            category,
            content,
            description,
            coverImage,
            createdBy: req.user._id
        });

        await articleDetails.save();
        res.status(201).json({ message: "Article created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating Article" });
    }
})

articleRouter.delete("/:id", auth, async (req, res) => {
    try {
        const articleId = req.params.id;
        const userId = req.user._id;

        const article = await articleModel.findOne({ _id: articleId, createdBy: userId });

        if (!article) {
            return res.status(404).json({ message: "Article not found or you are not authorized to delete this article" });
        }

        await articleModel.deleteOne({ _id: articleId });

        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Article" });
    }
});

module.exports = {
    articleRouter
}