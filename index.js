const express = require("express");
const ejs = require("ejs");
const enmap = require("enmap");
const slugify = require("slugify");
const { Logger, Message, getLogger } = require("./log");
const logger = getLogger("${date(false, true, true)}/INFO");
const Article = require("./modules/article");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const { user, pass } = require("./config");
/**
 * @param {string|Message} message
 * @param {string?} safeMessage
 */
function log(message, safeMessage) {
  logger.log(message, safeMessage);
}

const app = express();
const db = new enmap({
  name: "blogsite",
  fetchAll: false,
  autoFetch: true,
});
db.set("blogs", {});
app.use(cookieparser());
log("App and Database enabled");
app.use(bodyparser.urlencoded());
app.set("view-engine", ejs);
app.get("/blog/:slug", (req, res) => {
  let blog = db.get("blogs", req.params.slug);
  if (!blog) return res.redirect("/");
  res.render("blogpost.ejs", { article: Article.fromJSON(blog) });
});

app.get("/", (req, res) => {
  let objects = Object.values(db.get("blogs")).slice(0, 10);
  res.render("index.ejs", { objects });
});

app.post("/api/add", (req, res) => {
  if (req.cookies?.creds && req.cookies?.creds == user + ":" + pass) {
    if (
      req.body.title != null &&
      req.body.headline != null &&
      req.body.contents != null &&
      req.body.image != null
    ) {
      let art = new Article(
        req.body.title,
        req.body.headline,
        slugify.default(req.body.title),
        req.body.contents,
        req.body.image
      );
      db.set("blogs", art.toJSON(), art.slug);
      res.redirect("/blog/" + art.slug);
    } else res.redirect("/");
  } else res.redirect("/");
});

app.get("/login", (req, res) => res.render("login.ejs"));

app.get("/add", (req, res) => {
  if (req.cookies?.creds && req.cookies?.creds == user + ":" + pass)
    res.render("add.ejs");
  else res.redirect("/");
});

app.get("/search", (req, res) => {
  if(!req.query.q) return res.redirect("/");
  let arts = Object.values(db.get("blogs"));
  let results = [];
  arts.forEach(el=>{
    if(el.headline.toLowerCase().includes(req.query.q.toLowerCase())) return results.push(el);
    if(el.title.toLowerCase().includes(req.query.q.toLowerCase())) return results.push(el);
  });
  res.render("index.ejs", { objects: results });
})

app.use(express.static(__dirname+"/public"));

app.listen(80, () => {
  log("App is listening on port 80");
});