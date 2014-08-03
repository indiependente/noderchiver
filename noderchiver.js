var fs 		=	require('fs');
var fstream =	require('fstream');
var zlib 	=	require('zlib');
var tar 	=	require('tar');
var parser	=	tar.Parse();


function dirExists (d, cb) {
  fs.stat(d, function (er, s) { cb(er || !s.isDirectory()); });
}
function triggerIfDir(err){
	if (err){
		console.error("Can't find %s folder!", FOLDER);
		throw err;
	}
	pressIt(packIt(FOLDER));
}


function packIt(dir){
	return fstream.Reader({ path: dir, type: "Directory" })
  	.pipe(tar.Pack({ noProprietary: true }))
}

function packOnly(dir){
	var dir_destination = fs.createWriteStream(dir + '.tar');
	packIt(dir).pipe(dir_destination);
}

function pressIt(stream){
	var file_destination = fs.createWriteStream(FOLDER + '.tar.gz');
	stream.pipe(zlib.createGzip()).pipe(file_destination);
}

// parse args
var FOLDER	=	process.argv[2];
console.log('Compressing ' + FOLDER + '...');
dirExists(FOLDER, triggerIfDir);
