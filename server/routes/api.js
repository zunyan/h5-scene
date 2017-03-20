/**
 * 	这些API是提供给前端直接调用的 
 */

var express = require('express');
var router = express.Router();

var fs = require("fs");
var path = require("path");
var h5Linker = require("../lib/h5Linker");

/**
 * 预览
 */
var index = 0;
router.post('/generatePageToPreview.do', function(req, res) {

	res.header("Content-Type", "application/json; charset=utf-8");
	var out = h5Linker(req.body);
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