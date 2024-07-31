const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const path = require("path");
const multer = require("multer");
const { diskStorage } = require("../middleware/upload.middleware");
const { caseStudyModel } = require("../model/caseStudy.model");

const caseStudyRouter = express.Router();

const baseDir = path.join(__dirname, '../uploads');
const upload = multer({ storage: diskStorage(baseDir, { coverImage: 'caseStudyImages' }) });


caseStudyRouter.get("/", auth, async (req, res) => {
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
            const users = await userModel.find({
                $or: [
                    { firstname: { $regex: createdBy, $options: 'i' } },
                    { lastname: { $regex: createdBy, $options: 'i' } }
                ]
            });
            const userIds = users.map(user => user._id);
            query.createdBy = { $in: userIds };
        }

        const options = {
            populate: [
                { path: 'createdBy', select: 'firstname lastname profilePic' },
                { path: 'comments.user', select: 'firstname lastname profilePic' }
            ],
        };

        const caseStudies = await caseStudyModel.paginate(query, options);

        res.status(200).json({
            caseStudies: caseStudies.docs,
            totalData: caseStudies.totalDocs,
            pages: caseStudies.totalPages
        });

    } catch (error) {
        res.status(500).json({ message: "Error getting Case Study" });
    }
})

caseStudyRouter.post("/", auth, upload.single("coverImage"), async (req, res) => {
    const { title, category, content, videoUrl } = req.body;
    try {
        const coverImage = req.file ? req.file.filename : undefined;

        const caseStudyDetails = new caseStudyModel({
            title,
            category,
            content,
            coverImage,
            videoUrl,
            createdBy: req.user._id
        })

        await caseStudyDetails.save();
        res.status(200).json({ message: "Case Study created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating Case Study" });
    }
})


caseStudyRouter.delete("/:id", auth, async (req, res) => {
    try {
        const caseStudyId = req.params.id;
        const userId = req.user._id;

        const caseStudy = await caseStudyModel.findOne({ _id: caseStudyId, createdBy: userId });
        if (!caseStudy) {
            return res.status(404).json({ message: "Case Study not found or you are not authorized to delete this Case Study" });
        }
        await caseStudyModel.deleteOne({ _id: caseStudyId });
        
        res.status(200).json({ message: "Case Study deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting Case Study" });
    }
})

caseStudyRouter.post("/:id/comments", auth, async (req, res) => {
    const caseStudyId = req.params.id;
    const { comment } = req.body;

    try {
        const caseStudy = await caseStudyModel.findById(caseStudyId);
        if (!caseStudy) {
            return res.status(404).json({ message: "Case Study not found" });
        }

        const newComment = {
            user: req.user._id,
            comment,
            createdAt: new Date()
        };

        caseStudy.comments.push(newComment);
        await caseStudy.save();

        res.status(200).json({ message: "Comment added successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error adding comment"});
    }
});

module.exports = {
    caseStudyRouter
}