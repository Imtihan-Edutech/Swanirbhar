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

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/article", articleRouter);
app.use("/blog", blogRouter);
app.use("/caseStudy",caseStudyRouter)
app.use("/", aiRouter)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.listen(process.env.PORT || 3000, async () => {
    try {
        await connection;
        console.log("DB Connected Successfully");
        console.log(`Server is Running on Port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
