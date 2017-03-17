/**
 * 	这些API是提供给前端直接调用的 
 */

var express = require('express');
var router = express.Router();

var fs = require("fs");
var path = require("path");
var ejs = require("ejs");

/**
 * 预览
 */
var index = 0;
router.post('/generatePageToPreview.do', function(req, res) {

	res.header("Content-Type", "application/json; charset=utf-8");
	var file = fs.readFileSync(path.resolve(__dirname, '../template/stage.ejs')).toString();
	var out = ejs.render(file, req.body, {filename: path.resolve(__dirname, '../template/stage.ejs')});
	var newFileName = req.body.url || ("cache/" + (+new Date()) + index + ".html");
	fs.writeFileSync(newFileName, out);
	res.end(JSON.stringify({
		code: 0,
		msg: 0,
		data: newFileName
	}));
	index++;
});


module.exports = router;