require('dotenv').config();
require('express-async-errors');

// packages
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const PORT = process.env.PORT || 8080;

var corsOption = {
    origin: 'http://localhost:5050'
}

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(xss());
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

// api
app.get('/', (req, res) => {
    res.json({message: 'hello word'})
})

//Register All Routes
require("./routes/")(app);

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

