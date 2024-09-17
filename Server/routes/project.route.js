const express = require("express");
const { projectModel } = require("../model/project.model");
const { auth } = require("../middleware/auth.middleware");
const { access } = require("../middleware/access.middleware");
const projectRouter = express.Router();

projectRouter.get("/", async (req, res) => {
    try {
        const { title, club, difficulty } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 60;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (club) {
            query.club = club;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        const option = {
            populate: [
                { path: 'creator', select: 'fullName profilePic' },
            ],
            page,
            limit
        };


        const projects = await projectModel.paginate(query, option)

        res.status(200).json({
            projects: projects.docs,
            totalData: projects.totalDocs,
            pages: projects.totalPages,
            currentPage: projects.page
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
})

projectRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectModel
            .findById(id)
            .populate('creator', 'fullName profilePic')
            .populate('submissionLink.submittedBy', 'fullName profilePic');

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: "Error fetching project details" });
    }
});


projectRouter.post("/", auth, access("entrepreneur"), async (req, res) => {
    try {
        const {
            title,
            description,
            task,
            prerequisites,
            submissionMethod,
            deadline,
            difficulty,
            learningSkills,
            club,

        } = req.body;

        const newProject = new projectModel({
            title,
            description,
            task,
            prerequisites,
            submissionMethod,
            deadline,
            difficulty,
            learningSkills,
            club,
            creator: req.user._id
        });

        await newProject.save();
        res.status(201).json({ message: "Project added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding project" });
    }
});

projectRouter.post("/:id/submit-link", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { link, description } = req.body;

        if (!link) {
            return res.status(400).json({ message: "Link is required" });
        }

        const project = await projectModel.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const userSubmissions = project.submissionLink.filter(submission => submission.submittedBy.toString() === req.user._id.toString());

        if (userSubmissions.length > 0) {
            return res.status(400).json({ message: "You have already submitted a link for this project" });
        }

        project.submissionLink.push({
            link,
            description,
            submittedBy: req.user._id,
            submittedAt: new Date()
        });

        await project.save();
        res.status(200).json({ message: "Link submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting link" });
    }
});


projectRouter.put("/:id", auth, access("entrepreneur"), async (req, res) => {
    try {
        const { id } = req.params;
        const { deadline } = req.body;

        if (!deadline) {
            return res.status(400).json({ message: "Deadline is required" });
        }

        const project = await projectModel.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.creator.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized to edit this project" });
        }

        project.deadline = deadline;

        await project.save();
        res.status(200).json({ message: "Deadline updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating deadline", error });
    }
});


projectRouter.post("/:id/give-grade", auth, access("entrepreneur"), async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, grades } = req.body;

        const project = await projectModel.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.creator.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized to grade this project" });
        }

        const existingGrade = project.grading.find(g => g.user.toString() === userId);
        if (existingGrade) {
            return res.status(400).json({ message: "Grades for this user already exist" });
        }

        project.grading.push({
            user: userId,
            gradedBy: req.user._id,
            grades
        });

        await project.save();
        res.status(200).json({ message: "Grades submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting grades" });
    }
});

projectRouter.delete('/:id',auth, async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectModel.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting project" });
    }
})

module.exports = {
    projectRouter
};
