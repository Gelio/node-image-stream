var fs = require('fs');
module.exports = fetchFileNames;

function fetchFileNames(imagesDirectory) {
    return new Promise(function(resolve, reject) {
        fs.readdir(__dirname + "/" + imagesDirectory, function(err, files) {
            if(err) {
                console.error("Cannot fetch file names");
                reject(new Error('invalid directory'));
            }

            console.log("File names found", files);
            resolve(files);
        });
    });
}