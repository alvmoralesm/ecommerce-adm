const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const ejsMate = require("ejs-mate");

const clientRoutes = require("./routes/client");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/products", clientRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
