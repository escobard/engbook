const express = require("express");

const cookieSession = require("cookie-session");
const passport = require("passport");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const { port } = require("./constants/routes");
const { cookieKey } = require("./constants/config");

require("./models");

require("./services/passport");

const app = express();

app.use(helmet());

// express does not parse data with post requests, so we need to use the bodyParser library
// to enable json data parsing via the bodyParser.json() middlware.

// this essentially parses the post.body with the json data, allowing us to call post request data
// via req.body within route handlers
app.use(bodyParser.json());

app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [cookieKey] }));

app.use(passport.initialize());
app.use(passport.session());

// this syntax allows us to abbreviate the require statement and immediately invoke our routes
/* replaces the following syntax:
	const routes = require('./routes')
	routes(app)
*/
require("./routes")(app);

// this block of code routes all routes that are NOT defined within the server to render client side 
// assets
if (process.env.NODE_ENV === "production") {
	// Express will serve up production assets
	// like our main.js file, or main.css file!
	app.use(express.static("client/build"));

	// Express will serve up the index.html file
	// if it doesn't recognize the route
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
let server = app.listen(port, () => {
	console.log("server listening at port %s", port);
});

module.exports = server;
