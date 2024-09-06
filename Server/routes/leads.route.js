const express = require("express");
const nodemailer = require("nodemailer");
const { leadsModel } = require("../model/leads.model");
const leadsRouter = express.Router();
require("dotenv").config();

leadsRouter.post("/", async (req, res) => {
    const {
        fullname,
        email,
        mobile,
        areasToExplore,
        shareAssignmentsThesisExpertise,
        qualification,
        fieldOfExpertise,
        state,
        pinCode,
        introduction,
        interest,
        positiveChange
    } = req.body;

    try {
        const lead = new leadsModel({
            fullname,
            email,
            mobile,
            areasToExplore,
            shareAssignmentsThesisExpertise,
            qualification,
            fieldOfExpertise,
            state,
            pinCode,
            introduction,
            interest,
            positiveChange
        });

        await lead.save();

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
            subject: 'Swanirbhar Waitlist Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px; margin: 0;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333333; font-size: 24px; text-align: center;">Welcome to Swanirbhar, ${fullname}!</h2>
                        <p style="font-size: 16px; color: #555555; text-align: center; line-height: 1.5;">
                            Thank you for joining our waitlist. We are excited to have you with us.
                        </p>
                        <p style="font-size: 16px; color: #555555; text-align: center; line-height: 1.5;">
                            Your information has been received, and our team will be in touch soon to guide you through the next steps.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://swanirbhar.in" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
                        </div>
                        <p style="font-size: 14px; color: #999999; text-align: center; margin-top: 40px;">
                            &copy; ${new Date().getFullYear()} Swanirbhar. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Your waitlist request was successfully submitted." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
    }
});

module.exports = {
    leadsRouter
};
