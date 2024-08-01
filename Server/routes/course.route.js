const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { courseModel } = require("../model/course.model");
const { access } = require("../middleware/access.middleware");
const { diskStorage, multerConfig } = require("../middleware/upload.middleware");
const multer = require("multer");
const courseRouter = express.Router();
const fs = require('fs');
const path = require("path");
const { userModel } = require("../model/user.model");
const validateFileSize = require("../middleware/validateFileSize.middleware");

const baseDir = path.join(__dirname, '../uploads/courseImages');
const folders = { thumbnail: 'thumbnails', coverImage: 'coverImages', demoVideo: 'demoVideo', notes: 'notes' };
const upload = multerConfig(baseDir, folders);

const uploadVideo = multer({ storage: diskStorage('Videos') });

// Get All Courses
courseRouter.get("/", auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit);
        let sortDirection = req.query.order === "desc" ? -1 : 1;

        const { courseName, courseType, category, createdBy, level, language, hasCompletionCertificate, hasAssignments, hasSupport, tags } = req.query;
        const query = {};

        if (courseName) {
            query.courseName = { $regex: courseName, $options: 'i' };
        }
        if (courseType) {
            query.courseType = courseType;
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
        if (category) {
            query.category = category;
        }
        if (level) {
            query.level = level;
        }
        if (language) {
            query.language = language;
        }
        if (hasCompletionCertificate !== undefined) {
            query.hasCompletionCertificate = hasCompletionCertificate === 'true';
        }
        if (hasAssignments !== undefined) {
            query.hasAssignments = hasAssignments === 'true';
        }
        if (hasSupport !== undefined) {
            query.hasSupport = hasSupport === 'true';
        }
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        const sortOptions = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price':
                    sortOptions.price = sortDirection;
                    break;
                case 'rating':
                    sortOptions.rating = sortDirection;
                    break;
                case 'startDate':
                    sortOptions.startDate = sortDirection;
                    break;
                case 'createdAt':
                    sortOptions.createdAt = sortDirection;
                    break;
                default:
                    break;
            }
        }
        const options = {
            page,
            limit,
            populate: [
                { path: 'createdBy', select: 'firstname email lastname profilePic' },
                { path: 'enrolledUsers', select: 'firstname email lastname profilePic' },
                { path: 'patnerInstructor', select: 'firstname lastname email profilePic' },
                { path: 'comments.user', select: 'firstname lastname email profilePic' },
                { path: 'comments.replies.user', select: 'firstname email lastname profilePic' }],
            sort: sortOptions
        };
        const courses = await courseModel.paginate(query, options);

        res.status(200).json({
            courses: courses.docs,
            totalData: courses.totalDocs,
            pages: courses.totalPages
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to get course details. Try again later." });
    }
});


//Get only those Courses which Added by User
courseRouter.get("/myAddedCourses", auth, async (req, res) => {
    try {
        const { courseName } = req.query;

        const query = {
            createdBy: req.user._id
        };

        if (courseName) {
            query.courseName = { $regex: courseName, $options: 'i' };
        }

        const options = {
            populate: [
                { path: 'createdBy', select: 'firstname email lastname profilePic' },
                { path: 'enrolledUsers', select: 'firstname email lastname profilePic' },
                { path: 'patnerInstructor', select: 'firstname lastname email profilePic' },
                { path: 'comments.user', select: 'firstname lastname email profilePic' },
                { path: 'comments.replies.user', select: 'firstname email lastname profilePic' }],
        };

        const courses = await courseModel.paginate(query, options);

        res.status(200).json({
            courses: courses.docs,
            totalData: courses.totalDocs,
            pages: courses.totalPages
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to get course details. Try again later." });
    }
});

//Get only those Courses which Enrolled by User
courseRouter.get("/myEnrolledCourses", auth, async (req, res) => {
    try {
        const { courseName } = req.query;

        const query = {
            enrolledUsers: req.user._id
        };

        if (courseName) {
            query.courseName = { $regex: courseName, $options: 'i' };
        }

        const options = {
            populate: [
                { path: 'createdBy', select: 'firstname email lastname profilePic' },
                { path: 'enrolledUsers', select: 'firstname email lastname profilePic' },
                { path: 'patnerInstructor', select: 'firstname lastname email profilePic' },
                { path: 'comments.user', select: 'firstname lastname email profilePic' },
                { path: 'comments.replies.user', select: 'firstname email lastname profilePic' }],
        };
        const courses = await courseModel.paginate(query, options);

        res.status(200).json({
            courses: courses.docs,
            totalData: courses.totalDocs,
            pages: courses.totalPages
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to get course details. Try again later." });
    }
});

// Get details of a specific Course
courseRouter.get("/:id", auth, async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await courseModel.findById(courseId).populate('createdBy').populate('enrolledUsers');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ message: "Error getting course details" });
    }
});

//Create the Course
courseRouter.post("/", auth, access("freelancer"), upload.fields([{ name: 'thumbnail' }, { name: 'coverImage' }, { name: 'demoVideo' }]), validateFileSize, async (req, res) => {
    const { courseName, courseType, shortdescription, description, category, startDate,
        price, discount, level, language, duration, hasCompletionCertificate,
        hasAssignments, objectives, hasSupport, patnerInstructor, tags, faq } = req.body;
        
    try {
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].filename : undefined;
        const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].filename : undefined;
        const demoVideo = req.files['demoVideo'] ? req.files['demoVideo'][0].filename : undefined;

        const finalPrice = price - (price * (discount / 100));

        const courseDetails = new courseModel({
            courseName,
            courseType,
            shortdescription,
            description,
            category,
            createdBy: req.user._id,
            startDate,
            price: finalPrice,
            discount,
            level,
            language,
            duration,
            hasCompletionCertificate,
            hasAssignments,
            hasSupport,
            objectives: JSON.parse(objectives),
            thumbnail,
            coverImage,
            demoVideo,
            patnerInstructor: JSON.parse(patnerInstructor),
            tags: JSON.parse(tags),
            faq: JSON.parse(faq),
        });

        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }

        await courseDetails.save();
        res.status(201).json({ message: "Course created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating course" });
    }
});

//Update the Course
courseRouter.put("/:id", auth, upload.single('thumbnail'), async (req, res) => {
    const courseId = req.params.id;
    const { courseName, description, objectives, price, category, level, language, duration } = req.body;

    try {
        const thumbnailName = req.file ? req.file.filename : undefined;

        const updatedCourse = await courseModel.findByIdAndUpdate(courseId, {
            courseName, description, objectives, price, thumbnail: thumbnailName, category, level, language, duration
        }, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating course" });
    }
});

// Add multiple topics to a course
courseRouter.post("/:courseId/topics", uploadVideo.single('Videos'), auth, async (req, res) => {
    const { courseId } = req.params;
    const { title } = req.body;

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const authClient = await authorize();
        const filePath = req.file.path;
        const fileName = req.file.originalname;

        const file = await uploadFile(authClient, filePath, fileName);
        fs.unlinkSync(filePath);

        const videoURL = file.data.id;
        course.topics.push({ title, videoURL });

        await course.save();
        res.status(200).json({ message: "Topic added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

courseRouter.put("/:courseId/topics/:topicId", uploadVideo.single('Videos'), auth, async (req, res) => {
    const { courseId, topicId } = req.params;
    const { title } = req.body;

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const topic = course.topics.id(topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        if (req.file) {
            const authClient = await authorize();
            const filePath = req.file.path;
            const fileName = req.file.originalname;

            const file = await uploadFile(authClient, filePath, fileName);
            fs.unlinkSync(filePath);

            const videoURL = file.data.id;
            topic.videoURL = videoURL;
        }

        topic.title = title;

        await course.save();

        res.status(200).json({ message: "Topic updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//Enroll the Course
courseRouter.put("/enroll/:id", auth, async (req, res) => {
    const courseId = req.params.id;
    try {
        const courseDetails = await courseModel.findOne({ _id: courseId })
        if (!courseDetails) {
            return res.status(404).json({ message: "Course Does not Present" });
        }

        if (courseDetails.enrolledUsers.includes(req.user._id)) {
            return res.status(400).json({ message: "Already Enrolled in this Course" });
        }

        await courseModel.updateOne({ _id: courseId }, { $set: { enrolledUsers: [...courseDetails.enrolledUsers, req.user._id] } })

        res.status(200).json({ message: "Course Enrolled successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating course" });
    }
});

//Delete the Course
courseRouter.delete("/:id", auth, async (req, res) => {
    try {
        await courseModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error });
    }
});

courseRouter.get('/get-video/:fileId', auth, async (req, res) => {
    try {
        const authClient = await authorize();
        const fileStream = await getFile(authClient, req.params.fileId);

        fileStream.on('error', () => {
            res.status(500).send('Error streaming video');
        }).pipe(res);

    } catch (error) {
        res.status(500).send('Internal server error');
    }
});


module.exports = {
    courseRouter
};
