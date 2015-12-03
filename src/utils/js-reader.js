var fs = require('fs');
var cachedFiles = {};

module.exports = {
    cache: function (fileName) {
        try {
            var location = require.resolve(fileName);
            cachedFiles[fileName] = fs.readFileSync(location, 'utf8');
        } catch (e) {
            console.error('Error reading ' + fileName);
        }
    },
    get: function (fileName) {
        if (!cachedFiles[fileName]) {
            this.cache(fileName);
        }
        //console.log(cachedFiles[fileName]);
        return cachedFiles[fileName];
    }
}