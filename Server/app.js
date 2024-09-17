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
const { leadsRouter } = require("./routes/leads.route");
const { promptLibraryRouter } = require("./routes/promptLibrary.route");
const { projectRouter } = require("./routes/project.route");

const app = express();

app.use(cors());
app.use(express.json());

//Swanirbhar.org.in
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/article", articleRouter);
app.use("/blog", blogRouter);
app.use("/caseStudy", caseStudyRouter)
app.use("/project",projectRouter);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//Swanirbhar.in
app.use("/leads", leadsRouter)
app.use("/promptLibrary", promptLibraryRouter)
app.use("/aiBot", aiRouter)


app.get('/', (req, res) => {
    res.json("Welcome To Swanirbhar");
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
