const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config')
const app = express();
const logger = require('./config/logger')
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subject');
const questionRoutes = require('./routes/question')
const examRoutes = require('./routes/exam')
mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch(err => {
        logger.error(err);
    });
app.use(cookieParser());
app.use(bodyParser.json());

app.use('api/v1/auth', authRoutes);
app.use('api/v1/subjects', subjectRoutes);
app.use('api/v1/questions', questionRoutes);
app.use('api/v1/exams', examRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
