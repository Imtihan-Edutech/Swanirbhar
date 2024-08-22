const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require('path')
const { connection } = require("./config/db.config");
const { userRouter } = require("./routes/user.route");
const aiRouter = require("./routes/openAI.route");
const { articleRouter } = require("./routes/article.route");
const { blogRouter } = require("./routes/blog.route");
const { caseStudyRouter } = require("./routes/caseStudy.route");
const { courseRouter } = require("./routes/course.route");
// const wishlistRouter = require("./routes/wishlist.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/article", articleRouter);
app.use("/blog", blogRouter);
app.use("/caseStudy", caseStudyRouter)
// app.use("/wishlist", wishlistRouter)
app.use("/", aiRouter)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
    res.json("Welcome To Swanirbhar.in");
})

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("DB Connected Successfully");
        console.log(`Server is Running on Port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
