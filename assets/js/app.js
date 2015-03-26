var fs = require("fs");
var path = require("path")
var utils = require("./utils")

function App(appDir)
{
  this.appDir = appDir;
  this.appInfo = JSON.parse(fs.readFileSync(appDir + "/package.json", "utf-8"));
}

App.prototype = {
  getIconURL: function(){
    if (this.appInfo.icon)
      return path.join(this.appDir, this.appInfo.icon);
    else
      return "assets/img/default_app_icon.png";
  },

  getAppURL: function () {
    var mainFile = this.appInfo.main || "index.html";
    var protocol = mainFile.split("://")[0].toLowerCase();

    if (protocol === "http" || protocol === "https")
      return mainFile;

    return path.join(this.appDir, mainFile);
  },

  getSpringboardItem: function(){
    var self = this;

    utils.readFile("assets/views/app.html", function (err, data) {
      console.log(data.toString());
    })

    var appWrap = $("<div class='app'></div>");

    var appIcon = $("<img class='appIcon'/>");
    appIcon.attr("src", this.getIconURL());

    var appName = $("<div class='appName'></div>");
    appName.html(this.appInfo.name);

    appWrap.append(appIcon).append(appName);

    appWrap.on("click", function () {
      var iframe = $("body").find("iframe[app-id='"+ self.appInfo.app_id +"']");

      function closeApp()
      {
        var shouldBackground = iframe.get(0).contentWindow.shouldBackground;

        if ($.isFunction(shouldBackground) && shouldBackground())
        {
          iframe.css("display", "none");
          iframe.attr("in-background", "in-background");
        }
        else
          iframe.remove();
      }

      if (!iframe[0])
      {
        iframe = $("<iframe class='appContainer'/>");

        $(iframe).load(function () {
          iframe.focus();

          if (iframe.attr("in-background"))
          {
            iframe.removeAttr("in-background");
          }
          else
          {
            $(iframe.get(0).contentWindow.document).on("keydown", function(e){
              if (e.keyCode == 27)
              {
                var onClose = iframe.get(0).contentWindow.onClose;

                if ($.isFunction(onClose))
                {
                  if (onClose())
                    closeApp();
                }
                else
                  closeApp();
              }
            });

            var onAppStart = iframe.get(0).contentWindow.onAppStart;

            if ($.isFunction(onAppStart))
            {
              var appInfo = {
                appDir: self.appDir
              };

              onAppStart(appInfo);
            }
          }
        });

        iframe.attr("src", self.getAppURL());
        iframe.attr("app-id", self.appInfo.app_id);

        $("body").append(iframe);
      }
      else
      {
        iframe.css("display", "block");
      }
    });

    return appWrap;
  }
};
