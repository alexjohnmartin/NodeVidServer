var guid = require('node-uuid');
var fs = require('fs'); 

module.exports = {

	hydrateTaggedFiles: function() {
		console.log("hydrating videos");

		_loadFilesFromLocation("E:\\Videos");
	},

	getVidsHtml: function() {
		return _html();
	},

	getPath: function(id) {
		return files.find(file => file.id === id).path;
	},

	getPlayerHtml: function(id) {
		return _player(id);
	},

	mimeType: function(path) {
		return _mimeType(path);
	}
}

var files = [];
var splitter = process.platform === "win32" ? '\\' : '/';

function _loadFilesFromLocation(path) {
	console.log('loading location: ' + path);
	fs.readdir(path, function(err, filesInDir) {
		if (filesInDir) {
			for (var i = 0; i < filesInDir.length; i++) {
				if (filesInDir[i].substring(0,1) != ".")
				{
					var full_path = path + splitter + filesInDir[i];
					if (fs.lstatSync(full_path).isDirectory())
						_loadFilesFromLocation(full_path);
					else if (_isSupportedVideo(full_path)) {
						_addFile(full_path, filesInDir[i]);
					}
				}
			}
		}
	});
}

function _addFile(newFilePath, filename) {
	const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
	const name = nameWithoutExtension.indexOf(' (') < 0 ? nameWithoutExtension : filename.substring(0, filename.lastIndexOf(' ('));
	const regex = /\(([0-9]{4})\)/
	const match = filename.match(regex);
	const year = match && match.length > 1 ? match[1] : null;
	const apikey = '30062e17';
	const uri = `https://www.omdbapi.com/?t=${name}&apikey=${apikey}&y=${year}`;
	fetch(uri)
		.then(response => response.json())
		.then(metadata => {
			// console.log("metadata: " + JSON.stringify(metadata));
			var fileObj = new Object(); 
			fileObj.year = year;
			fileObj.id = guid.v1(); 
			fileObj.path = newFilePath;
			fileObj.poster = metadata.Poster;
			fileObj.name = metadata.Title ? metadata.Title : name;
			fileObj.genre = metadata.Genre ? metadata.Genre.split(',').map(genre => genre.trim()) : null;
			files.push(fileObj);
			console.log("new file: " + JSON.stringify(fileObj));
		});
}

function _html() {
	return `<!DOCTYPE html>
		<html>
			<head>
				<title>Vids</title>
			</head>
			<body style="background:black;color:white">
				<h1>Vids</h1>
				<div style="display:grid;gap:50px;grid-template-columns: auto auto auto;">${_listItems()}</div>
			</body>
		</html>`;
}

function _player(id) {
	return `<!DOCTYPE html>
		<html>
			<head>
				<title>Vid player</title>
			</head>
			<body>
				<video height='100%' width='100%' autoplay playsinline>
					<source src="/vids/${id}" type="video/mp4">Your browser does not support the video tag.
				</video>
			</body>
		</html>`;
}

function _listItems() {
	return files.map(file => _listItem(file)).join(' ');
}

function _listItem(file) {
	if (file.poster) return `
		<div>
			<a href="/player/${file.id}" style="display:flex;flex-direction:column;">
				<h2>${file.name}</h2>
				<img src="${file.poster}" style="max-width:200px" />
			</a>
		</div>
	`;

	return `
		<div>
			<a href="/player/${file.id}">
				<h2>${file.name}</h2>
			</a>
		</div>
	`;
}

function _mimeType(path) {
	if (path.endsWith(".avi"))
		return "video/x-msvideo";
	if (path.endsWith(".wmv"))
		return"video/x-ms-wmv";
	if (path.endsWith(".rm"))
		return "application/vnd.rn-realmedia";

	return "video/mp4";
}

function _isSupportedVideo(path) {
	if (path.endsWith(".mp4")) return true;
	if (path.endsWith(".mkv")) return true; 
	// TODO - other supported videos here?
	return false;
}