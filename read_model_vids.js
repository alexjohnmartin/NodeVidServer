var guid = require('node-uuid');
var fs = require('fs'); 

module.exports = {

	hydrateTaggedFiles: function() {
		console.log("hydrating videos");

		_loadFilesFromLocation("C:\\Users\\AlexM\\Videos");
	},

	getVidsHtml: function() {
		return _html();
	},

	getPath: function(id) {
		return files.find(file => file.id === id).path;
	},

	getPlayerHtml: function(id) {
		return _player(id);
	}
}

var files = [];
var splitter = '\\';

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
					else if (full_path.endsWith(".mp4")) {
						var fileObj = new Object(); 
						fileObj.id = guid.v1(); 
						fileObj.path = full_path;
						fileObj.name = filesInDir[i];
						fileObj.mime = mimeType(full_path);
						files.push(fileObj);
					}
				}
			}
		}
	});
}

function _html() {
	return `<!DOCTYPE html><html><head><title>Vids</title></head><body><h1>Vids</h1><ul>${_listItems()}</ul></body></html>`;
}

function _player(id) {
	return `<!DOCTYPE html><html><head><title>Vid player</title></head><body><video height='100%' width='100%' autoplay><source src="/vids/${id}" type="video/mp4">Your browser does not support the video tag.</video></body></html>`;
}

function _listItems() {
	return files.map(file => `<li><a href="/player/${file.id}">${file.name}</a></li>`).join(' ');
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
