const express = require("express");
const { userModel } = require("../model/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { multerConfig } = require("../middleware/upload.middleware");
const path = require("path");
const validateFileSize = require("../middleware/validateFileSize.middleware");
const { auth } = require("../middleware/auth.middleware");
const crypto = require('crypto');
require("dotenv").config();

const baseDir = path.join(__dirname, '../uploads/profileImages');
const folders = { profilePic: 'profilePic', coverImage: 'coverImage' };
const upload = multerConfig(baseDir, folders);

// Get All Users details
userRouter.get("/", auth, async (req, res) => {
    try {
        const { fullName, email } = req.query;
        let query = {};

        if (fullName || email) {
            query.$or = [];
            if (fullName) {
                query.$or.push({ fullName: { $regex: fullName, $options: "i" } });
            }
            if (email) {
                query.$or.push({ email: { $regex: email, $options: "i" } });
            }
        }

        const userDetails = await userModel.paginate(query);
        res.status(200).json(userDetails.docs);

    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve data. Please try again later." });
    }
});


// Get user details by ID
userRouter.get("/:id", async (req, res) => {
    try {
        const userDetails = await userModel.findById(req.params.id)
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve user details. Please Try again later." });
    }
});

// Send OTP for user registration
userRouter.post("/sendVerificationOTP", async (req, res) => {
    const { email, fullName } = req.body;
    try {
        const existingUserByEmail = await userModel.findOne({ email });

        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already exists, Please login" });
        }

        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `Swanirbhar <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Swanirbhar Account Verification OTP',
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 10px; margin: 0; text-align: center;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; font-size: 24px;">Hello ${fullName},</h2>
                <p style="font-size: 16px; color: #666;">Thank you for registering with Swanirbhar. We're excited to have you on board!</p>
                <p style="font-size: 18px; color: #555;">Your OTP for account verification is:</p>
                <h3 style="font-size: 36px; color: #4CAF50; margin: 20px 0; font-weight: bold;">${verificationOTP}</h3>
                <p style="font-size: 16px; color: #666;">Please use this OTP to complete your registration process.</p>
                <p style="font-size: 14px; color: #999;">If you did not initiate this request, please ignore this email.</p>
                <br>
                <p style="font-size: 16px; color: #333;">Best regards,</p>
                <p style="font-size: 16px; color: #333; font-weight: bold;">The Swanirbhar Team</p>
                <br>
                <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Swanirbhar. All rights reserved.</p>
            </div>
        </div>
    `
        };

        await transporter.sendMail(mailOptions)

        const userDetails = new userModel({
            email,
            verificationOTP
        });

        await userDetails.save();
        res.status(200).json({ message: 'OTP has been sent to your email address.' });
    } catch (error) {
        res.status(500).json({ message: "Unable to send OTP. Please Try again later." });
    }
});

// Register a new user with OTP verification
userRouter.put("/register/:email", async (req, res) => {
    const { fullName, password, verificationOTP } = req.body;
    const email = req.params.email;

    try {
        const userDetails = await userModel.findOne({ email });

        if (userDetails.verificationOTP !== verificationOTP) {
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error while hashing the password" });
            }

            userDetails.fullName = fullName;
            userDetails.password = hash;
            userDetails.verificationOTP = null;

            await userDetails.save();
            return res.status(200).json({ message: "Registration successful, You can now login" });
        });
    } catch (error) {
        return res.status(500).json({ message: "Registration Failed, Please Try again later." });
    }
});

// Login a user and generate JWT token
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: "Email does not exist, Please Sign Up" });
        }

        if(user.role === "suspended"){
            return res.status(400).json({ message: "Accoutn is Suspended, Please contact Admin" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
            res.status(200).json({ message: "Login Successful", token, userId: user._id, role: user.role });
        } else {
            res.status(400).json({ message: "Incorrect Email or Password" });
        }

    } catch (error) {
        res.status(500).json({ message: "Login Failed. Please try again later." });
    }
});

userRouter.post('/createUsers', auth, async (req, res) => {
    const { fullName, email, phoneNumber, role } = req.body;

    try {
        const userDetails = await userModel.findOne({ email });

        if (userDetails) {
            return res.status(400).json({ message: `User with this email already exists as ${userDetails.role}.` });
        }

        const password = crypto.randomBytes(4).toString('hex');

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: `Error while hashing the password. Please try again later.` });
            }

            const newUser = new userModel({
                fullName,
                email,
                phoneNumber,
                password: hash,
                role,
            });

            await newUser.save();

            const transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `Swanirbhar <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to Swanirbhar!',
                html: `
          <h1 style="color: #333;">Welcome to Swanirbhar, ${fullName}!</h1>
          <p>We are thrilled to have you as a <strong>${role}</strong> on our platform.</p>
          <h2>Your Login Credentials:</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p style="color: #555;">Please use the above credentials to log in. For your security, we highly recommend changing your password after your first login.</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p style="font-size: 16px; color: #333;">Best regards,</p>
          <p style="font-size: 16px; color: #333; font-weight: bold;">The Swanirbhar Team</p>
          <br>
          <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Swanirbhar. All rights reserved.</p>
        `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: `User registration successful, but the email could not be sent.` });
                } else {
                    return res.status(200).json({ message: `User registered successfully as ${role}. The login credentials have been sent.` });
                }
            });
        });
    } catch (error) {
        return res.status(500).json({ message: `An error occurred during registration. Please try again later.` });
    }
});

// Send OTP for password reset
userRouter.put("/sendResetPasswordOTP", async (req, res) => {
    const { email } = req.body;
    const resetPasswordOTP = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'Email not found. Please check your email address.' });
        }

        existingUser.resetPasswordOTP = resetPasswordOTP;
        await existingUser.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Swanirbhar: Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; text-align: center;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 16px; color: #666;">You have requested a password reset for your Swanirbhar account.</p>
                        <p style="font-size: 18px; color: #555;">Your OTP for password reset is:</p>
                        <h3 style="font-size: 36px; color: #4CAF50; margin: 20px 0; font-weight: bold;">${resetPasswordOTP}</h3>
                        <p style="font-size: 16px; color: #666;">Please use this OTP to complete your password reset process.</p>
                        <p style="font-size: 14px; color: #999;">If you did not request this, please ignore this email.</p>
                        <br>
                        <p style="font-size: 16px; color: #333;">Best regards,</p>
                        <p style="font-size: 16px; color: #333; font-weight: bold;">The Swanirbhar Team</p>
                        <br>
                        <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Swanirbhar. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP has been sent to your email address.' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to send OTP. Please Try again later.' });
    }
});

//Verify Reset password OTP
userRouter.post("/verifyOTP/:email", async (req, res) => {
    const { resetPasswordOTP } = req.body
    try {
        const userDetails = await userModel.findOne({ email: req.params.email });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found." });
        }

        if (userDetails.resetPasswordOTP !== resetPasswordOTP) {
            return res.status(400).json({ message: "Incorrect OTP. Please Check It Again" });
        }

        userDetails.resetPasswordOTP = null;
        await userDetails.save();
        res.status(200).json({ message: "OTP verified successfully." });

    } catch (error) {
        res.status(500).json({ message: "Unable to verify OTP. Please try again later" });
    }
});

// Reset password
userRouter.put("/resetPassword", async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'Email not found. Please check your email address.' });
        }

        bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: "Error while hashing the password" });
            }

            existingUser.password = hashedPassword;
            await existingUser.save();

            return res.status(200).json({ message: "Password updated successfully" });
        });

    } catch (error) {
        res.status(500).json({ message: 'Unable to update password. Please try again later' });
    }
});

// update the etails for the user 
userRouter.put("/updateDetails/:id", upload.fields([{ name: 'profilePic' }, { name: 'coverImage' }]), validateFileSize, async (req, res) => {
    const { id } = req.params;
    const { fullName, phoneNumber,dateOfBirth,gender, designation, bio, educations, skills, experience, facebook, linkedin, github, twitter, youtube } = req.body;

    const profilePic = req.files['profilePic'] ? req.files['profilePic'][0].filename : undefined;
    const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].filename : undefined;

    try {
        let user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fullName) user.fullName = fullName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (gender) user.gender = gender;
        if (designation) user.designation = designation;
        if (bio) user.bio = bio;
        if (skills) user.skills = skills;
        if (educations) user.educations = educations;
        if (experience) user.experience = experience;
        if (profilePic) user.profilePic = profilePic;
        if (coverImage) user.coverImage = coverImage;
        if (facebook) user.socials.facebook = facebook;
        if (linkedin) user.socials.linkedin = linkedin;
        if (github) user.socials.github = github;
        if (twitter) user.socials.twitter = twitter;
        if (youtube) user.socials.youtube = youtube;

        await user.save();

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Unable to update user details. Please Try again later." });
    }
});

userRouter.put('/editUser/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { fullName, phoneNumber, status } = req.body;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.status = status !== undefined ? status : user.status;

        await user.save();

        return res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable to update user details. Please Try again later.' });
    }
});


module.exports = {
    userRouter
};
