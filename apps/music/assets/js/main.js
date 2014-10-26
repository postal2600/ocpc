var fs = require("fs");
var path = require("path");

var mm = require('musicmetadata');

var songFolder;

var player = new Player();

function onAppStart(appInfo)
{
    $("#nowPlaying").on("click", $.proxy(player.show, player));

    songFolder = path.join(appInfo.appDir, "songs");

    fs.readdir(songFolder, function (err, files) {
        var songsDOM = $("#playlist");

        files.filter(function (file) {
            return file.substr(-4).toLowerCase() === ".mp3";
        }).forEach(function(file){
            var song = new Song(file);

            player.addSong(song);
            songsDOM.append(song.getDOM());
            song.updateInfoFromID3();
        });

        $("#playlist").mCustomScrollbar({
            theme: "light-thick"
        });
    });
}

function shouldBackground()
{
    return player.playing;
}
