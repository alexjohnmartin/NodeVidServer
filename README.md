# Node Video Server

## Summary

This is a lightweight video streaming server, built using NodeJS and Express. 

It is designed to locally stream videos (primarily MP4). It is NOT designed for high performance, usability, accessbility, scalability and internationalization - this is a personal project so I can have an old computer (perhaps a Raspberry Pi) stream videos from a hard disk to my TV.

## Dependencies and setup

This project depends on [NodeJS](https://nodejs.org/).

Once you've installed Node (including NPM) and downloaded this repo, as with any NodeJS project you'll then want to get the dependent libraries, on the command line you'd run this: 
`npm install`

## Configuration

### Video location

Currently this project searches for videos in 1 or more base directories (it will then traverse any sub-directories).

You can set your video root directories by altering and adding `_loadFilesFromLocation(path)` lines in the read_modal_vids.js file, on line 9. 

### Windows vs Mac/Linux
Don't worry, this isn't a platform rant. But depending on your OS you will want to alter line 30 in read_modal_vids.js - this needs to be set to the correct type of path delimited (forward or back slash) for your OS. 

For Windows it should be: 
`var splitter = '\\';`

For Mac/Linux it should be: 
`var splitter = '/';`

SIDE NOTE - yes, a future improvement is to alter this splitter to be dynamic, and not need manual alteration. 

## Running

Start the local video server form the command line using: 
`node app`

You can then access the interface using a web browser - make sure you specify the correct port number (`:3000`) in the URL.

If you are running this locally you can use:
`http://localhost:3000`

## Future improvements

* The layout of the `<video>` needs to be altered to be full screen
* The main UI should be MUCH better - the list of unstyled links is very difficult to use on a TV
* The list of video directories should really be in a config file
* As mentioned above the path splitter should be detected automatically

## References

My video streaming code is heavily borrowed from [here](https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0) - big thank you to [https://dev.to/abdisalan_js](Abdisalan).