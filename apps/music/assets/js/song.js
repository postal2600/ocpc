function Song(filename)
{
    this.playlistIndex = -1;
    this.filename = filename;
    this.fullPath = path.join(songFolder, filename);
    this.artist = null;
    this.title = null;
    this.picture = null;
    this.dom = null;
}

Song.prototype = {
    getDOM: function () {
        if (!this.dom)
        {
            var self = this;
            this.dom = $("<div class='song'></div>");

            var coverArt = $("<img src='assets/img/default_coverart.jpg'/>");
            var songInfo = $("<div class='songInfo'><span>"+ this.filename +"</span></div>");

            this.dom.append(coverArt).append(songInfo);

            this.dom.on("click", function(){
                player.play(self);
            });
        }

        return this.dom;
    },

    updateDOM: function()
    {
        var dom = this.getDOM();

        dom.find(".songInfo span").html(this.artist + " - " + this.title);

//        if (info.picture)
//        {
//            var rawImage = new Blob([this.picture.data], {'type': 'image/' + this.picture.format});
//
//            var reader = new FileReader();
//
//            reader.onload = function () {
//                dom.find("img").attr("src", reader.result);
//            };
//
//            reader.readAsDataURL(rawImage);
//        }
    },

    updateInfoFromID3: function(){
        var self = this;
        var parser = mm(fs.createReadStream(this.fullPath));

        parser.on('metadata', function (result) {
            self.artist = result.artist[0];
            self.title = result.title;
            self.picture = result.picture[0];

            self.updateDOM();
        });
    }
};
