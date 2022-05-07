var express = require('express')

var fs = require('fs'); 
var app = express();
var read_model_vids = require('./read_model_vids');

// server.js (Express 4.0)
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();

app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())    // parse application/json
app.use(methodOverride());                  // simulate DELETE and PUT

app.listen(3000);
console.log('Magic happens on port 3000');          // shoutout to the user

//******************************************************************************
//                          READ API
//******************************************************************************

app.get('/', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
	res.end(read_model_vids.getVidsHtml());
});

app.get('/player/:id', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
	res.end(read_model_vids.getPlayerHtml(req.params.id));
});

app.get('/vids/:id', function(req, res) {
	return_video(req, res);
});

//******************************************************************************
//                          helper methods
//******************************************************************************

function return_video(req, res) {
	// Ensure there is a range given for the video
	const range = req.headers.range;
	if (!range) {
	  res.status(400).send("Requires Range header");
	}
  
	// get video stats (about 61MB)
	const videoPath = read_model_vids.getPath(req.params.id);
	const videoSize = fs.statSync(videoPath).size;
  
	// Parse Range
	// Example: "bytes=32324-"
	const CHUNK_SIZE = 10 ** 6; // 1MB
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
	// Create headers
	const contentLength = end - start + 1;
	const headers = {
	  "Content-Range": `bytes ${start}-${end}/${videoSize}`,
	  "Accept-Ranges": "bytes",
	  "Content-Length": contentLength,
	  "Content-Type": mimeType(videoPath.toLowerCase()),
	};
  
	// HTTP Status 206 for Partial Content
	res.writeHead(206, headers);
  
	// create video read stream for this particular chunk
	const videoStream = fs.createReadStream(videoPath, { start, end });
  
	// Stream the video chunk to the client
	videoStream.pipe(res);
}

function mimeType(path) {
	if (path.endsWith(".avi"))
		return "video/x-msvideo";
	if (path.endsWith(".wmv"))
		return"video/x-ms-wmv";
	if (path.endsWith(".rm"))
		return "application/vnd.rn-realmedia";

	return "video/mp4";
}

//******************************************************************************
//                          hydrate from event store
//******************************************************************************
read_model_vids.hydrateTaggedFiles();
