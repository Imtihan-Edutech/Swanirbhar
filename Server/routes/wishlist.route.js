// const express = require("express");
// const auth = require("../middleware/auth.middleware");
// const Wishlist = require("../model/wishlist.model");
// const wishlistRouter = express.Router();

// wishlistRouter.get('/:userId', auth, async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const wishlist = await Wishlist.findOne({ user: userId }).populate('courses');
//         if (!wishlist) {
//             return res.status(404).json({ message: "Wishlist not found." });
//         }
//         res.status(200).json(wishlist);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to retrieve wishlist. Please try again later." });
//     }
// });

// wishlistRouter.post('/:userId/add', auth, async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { courseId } = req.body;

//         let wishlist = await Wishlist.findOne({ user: userId });
//         if (!wishlist) {
//             wishlist = new Wishlist({ user: userId, courses: [courseId] });
//         } else {
//             wishlist.courses.push(courseId);
//         }

//         await wishlist.save();
//         res.status(201).json({ message: "Course added to wishlist successfully." });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add course to wishlist. Please try again later." });
//     }
// });

// wishlistRouter.delete('/:userId/remove', auth, async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { courseId } = req.body;

//         const wishlist = await Wishlist.findOne({ user: userId });
//         if (!wishlist) {
//             return res.status(404).json({ message: "Wishlist not found." });
//         }

//         wishlist.courses = wishlist.courses.filter(course => course.toString() !== courseId);

//         await wishlist.save();
//         res.status(200).json({ message: "Course removed from wishlist successfully." });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to remove course from wishlist. Please try again later." });
//     }
// });

// module.exports = wishlistRouter
