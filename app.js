
const express = require("express");
const app = express();

app.use('/public/upload/', express.static(__dirname+'/public/upload/'))
const morgan = require("morgan");
const mongoose = require("mongoose");
//const cors = require("cors");
const dotenv = require("dotenv")
const authJwt = require("./helpers/jwt");
require('express-async-errors')
dotenv.config()

// Enable CORS
const cors = require('cors')
app.use(cors());

//middleware
//app.use(authJwt)
app.use(express.json());
app.use(morgan("tiny"));

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const errHandler = require("./middleware/errHandler");
const { _applyPlugins } = require("mongoose");

const api = process.env.API_URL;
app.use(`${api}/categories`,authJwt, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`,authJwt, ordersRoutes);

app.use(errHandler)
//Database
mongoose
  .connect(process.env.CONNECTION_STRING,{useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("server is running http://localhost:3000");
});
