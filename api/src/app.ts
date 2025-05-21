// Cache control settings
import cacheControl from "../config/cacheControl";
import express from "express";
import path from "path";

// app package loading
import app from "./app-setup";

// Setup the routes
import mailList from "./api/mailList";
import mailGetInfo from "./api/mailGetInfo";
import mailGetHtml from "./api/mailGetHtml";

// Define route handlers with proper Express types
const listHandler: express.RequestHandler = (req, res) => mailList(req, res);
const infoHandler: express.RequestHandler = (req, res) => mailGetInfo(req, res);
const htmlHandler: express.RequestHandler = (req, res) => mailGetHtml(req, res);

app.get("/api/v1/mail/list", listHandler);
app.get("/api/v1/mail/getInfo", infoHandler);
app.get("/api/v1/mail/getHtml", htmlHandler);

// Legacy fallback behaviour - 
// Note this is to be deprecated (after updating UI)
app.get("/api/v1/mail/getKey", infoHandler);

// Static regex 
const staticRegex = /static\/(js|css|img)\/(.+)\.([a-zA-Z0-9]+)\.(css|js|png|gif)/g;

// Static folder hosting with cache control
// See express static options: https://expressjs.com/en/4x/api.html#express.static
app.use(app.express.static(path.join(__dirname, "../public"), {
	etag: true,
	setHeaders: function (res: express.Response, path: string) {
		if (staticRegex.test(path)) {
			res.set('cache-control', cacheControl.immutable);
		} else {
			res.set('cache-control', cacheControl.static);
		}
	}
}));

// Custom 404 handling - use index.html
app.use(function(req: express.Request, res: express.Response) {
	res.set('cache-control', cacheControl.static);
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Setup the server
var server = app.listen(8000, function () {
	const address = server.address();
	if (typeof address !== 'string' && address !== null) {
		console.log("app running on port.", address.port);
	}
});
