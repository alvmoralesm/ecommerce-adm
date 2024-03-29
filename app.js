if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Installs + Imports
const path = require("path");
const express = require("express");
const app = express();
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

//Routes
const brandRoutes = require("./routes/brands");
const categoryRoutes = require("./routes/categories");
const subcategoryRoutes = require("./routes/subcategories");
const productRoutes = require("./routes/products");

//DB
const dbUrl = "mongodb://localhost:27017/eshopper";

main().catch((err) => console.log(err, "ERROR"));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("SUCCESS!");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const secret = "badsecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dv5vm4sqh/",
  "https://www.youtube.com/",
  "https://cdn.jsdelivr.net/",
  "https://code.jquery.com/",
  "https://cdn.datatables.net/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dv5vm4sqh/",
  "https://www.youtube.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdn.datatables.net/",
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/dv5vm4sqh/",
  "https://www.youtube.com/",
  "https://cdn.jsdelivr.net/",
];
const fontSrcUrls = ["https://res.cloudinary.com/dv5vm4sqh/"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dzuljpmwj/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net/", ...fontSrcUrls],
      mediaSrc: [
        "https://res.cloudinary.com/dv5vm4sqh/",
        "https://cdn.jsdelivr.net/",
      ],
      childSrc: ["blob:"],
    },
  })
);

app.use((req, res, next) => {
  console.log(req.query);
  /*   res.locals.signedInUser = req.user;
   */
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No. Something Went Wrong!";
  // console.dir(err.message);
  // console.log("------------------------------------------");
  // console.dir(err);
  res.status(status).render("error", { err });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
