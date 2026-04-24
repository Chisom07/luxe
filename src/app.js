// // src/app.js
// const express = require("express");
// const app = express();

// const routes = require("./routes");

// app.use(express.json());
// app.use(express.static("public"));

// app.use("/api", routes);

// module.exports = app;


const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");

const app = express();

app.get('/', async (req, res) => {
    res.send('REST API AUTHENTICATION AND AUTHORIZATION')
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

module.exports = app;