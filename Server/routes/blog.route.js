const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const path = require("path");
const multer = require("multer");
const { diskStorage } = require("../middleware/upload.middleware");

const { userModel } = require("../model/user.model");
const { blogModel } = require("../model/blog.model");

const blogRouter = express.Router();

const baseDir = path.join(__dirname, '../uploads');
const upload = multer({ storage: diskStorage(baseDir, { coverImage: 'blogImages' }) });


blogRouter.get("/", async (req, res) => {
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
                {
                    fullName: { $regex: createdBy, $options: 'i' }
                });
            const userIds = users.map(user => user._id);
            query.createdBy = { $in: userIds };
        }

        const options = {
            populate: [
                { path: 'createdBy', select: 'fullName profilePic' },
                { path: 'comments.user', select: 'fullName profilePic' }
            ],
        };

        const blogs = await blogModel.paginate(query, options);

        res.status(200).json({
            blogs: blogs.docs,
            totalData: blogs.totalDocs,
            pages: blogs.totalPages
        });

    } catch (error) {
        res.status(500).json({ message: "Error getting Blogs" });
    }
})

blogRouter.get("/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogModel
            .findById(blogId)
            .populate({
                path: 'createdBy',
                select: 'fullName profilePic'
            })
            .populate({
                path: 'comments.user',
                select: 'fullName profilePic'
            });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error getting blog" });
    }
});


blogRouter.post("/", auth, upload.single("coverImage"), async (req, res) => {
    const { title, category, content } = req.body;
    try {
        const coverImage = req.file ? req.file.filename : undefined;

        const blogDetails = new blogModel({
            title,
            category,
            content,
            coverImage,
            createdBy: req.user._id
        })

        await blogDetails.save();
        res.status(200).json({ message: "Blog created successfully" });

    }
    catch (error) {
        res.status(500).json({ message: "Error creating Blog" });
    }
})

blogRouter.delete("/:id", auth, async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        const blog = await blogModel.findOne({ _id: blogId, createdBy: userId });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found or you are not authorized to delete this blog" });
        }
        await blogModel.deleteOne({ _id: blogId });

        res.status(200).json({ message: "Blog deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting Blog" });
    }
})

blogRouter.post("/:id/comments", async (req, res) => {
    const blogId = req.params.id;
    const { comment } = req.body;

    try {
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newComment = {
            user: req.user._id,
            comment,
            createdAt: new Date()
        };

        blog.comments.push(newComment);
        await blog.save();

        res.status(200).json({ message: "Comment added successfully" });

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Error adding comment" });
    }
});

module.exports = {
    blogRouter
}