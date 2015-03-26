(function(){
  'use strict';

//    var gui = require('nw.gui');
//    gui.Window.get().enterFullscreen();

  var fs = require("fs");
  var path = require("path");

  var appsFolder = path.join(process.env.PWD, "apps");

  fs.readdir(appsFolder, function(err, files){

    var springboard = $("#springboard");

    for (var f=0; f < files.length; f++)
    {
      var appName = files[f];
      var appDir = path.join(appsFolder, appName);

      if (fs.statSync(appDir).isDirectory())
      {
        var app = new App(appDir);
        springboard.append(app.getSpringboardItem());
      }
    }
  })
})();
