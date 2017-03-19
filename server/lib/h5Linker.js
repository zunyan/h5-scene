var fs = require("fs");
var path = require("path");
var ejs = require("ejs");

var file = fs.readFileSync(path.resolve(__dirname, '../template/stage.ejs')).toString();
module.exports = function(data){
	return ejs.render(file, data, {
        filename: path.resolve(__dirname, '../template/stage.ejs')
    });
};