const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const api = require("./routers/api");
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/", api);

module.exports = app;