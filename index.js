var express = require('express'),
	app = express(),
	ejs = require('ejs'),
	fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser());
app.use('/', express.static(__dirname));

// set default page
app.get('/', function(req, res) {
	res.redirect("/scene/index.html");
});
app.post('/generatePageToPreview.do', function(req, res) {

	res.header("Content-Type", "application/json; charset=utf-8");

	var file = fs.readFileSync('template/stage.ejs').toString();
	var out = ejs.render(file, req.body, {filename: "index.js"});
	var newFileName = "cache/preview-" + 123 + ".html";
	fs.writeFileSync(newFileName, out);
	res.end(newFileName);
});

// start express
console.info("try set up express..");
app.listen(5050,function(){
	console.info("h5-scene is started in port -" + 5050)
	console.info("try set up node-sts-app-server..");
});
