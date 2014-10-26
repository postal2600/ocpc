function Player()
{
    this.playlist = [];
    this.currentSong = null;

    this.player = new Audio();
    this.player.addEventListener("ended", $.proxy(this.next, this));

    this.playing = false;

    this.progressTimer = null;

    $("#progressBar").on("click", $.proxy(function (e) {
        var clickPosition = e.pageX - $("#progressBar").parent().offset().left;

        var time2Skip = (this.player.duration * clickPosition) / $("#progressBar").width();

        this.player.currentTime = time2Skip;
        this.updateProgress();

    }, this));

    this.visible = false;

    this.playBtn = $("#playBtn");
    this.playBtn.on("click", $.proxy(this.play, this));

    this.pauseBtn = $("#pauseBtn");
    this.pauseBtn.on("click", $.proxy(this.pause, this));

    this.stopBtn = $("#stopBtn");
    this.stopBtn.on("click", $.proxy(this.stop, this));

    this.nextBtn = $("#nextBtn");
    this.nextBtn.on("click", $.proxy(this.next, this));

    this.prevBtn = $("#prevBtn");
    this.prevBtn.on("click", $.proxy(this.prev, this));

    $("#player").on("click", function(){
        return false;
    });

    $("#playerOverlay").on("click", $.proxy(this.hide, this));
}

Player.prototype = {

    addSong: function(song){
        song.playlistIndex = this.playlist.length;
        this.playlist.push(song);
    },

    show: function(){
        if (!this.visible)
        {
            $("body").addClass("playerOpened");
            this.visible = true;
        }
    },

    hide: function(){
        if (this.visible)
        {
            $("body").removeClass("playerOpened");
            this.visible = false;
        }
    },

    updateProgress: function () {
        var progress = (100 * this.player.currentTime) / this.player.duration;
        $("#progressFill").css("width", progress + "%");

        var currentTime = Math.round(this.player.currentTime);

        var minutes = Math.floor(currentTime / 60);
        var seconds = currentTime % 60;

        var time_s = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

        $("#currentTime").html(time_s);
    },

    play: function(song)
    {
        // check for filename to make sure not click event
        if (song && song.filename)
        {
            this.currentSong = song;

            this.player.src = path.join("songs", song.filename);
            $("#songTitle").html(song.artist + " - " + song.title);

            this.show();
        }

        this.player.play();

        this.playBtn.hide();
        this.pauseBtn.show();

        if (!this.progressTimer)
            this.progressTimer = setInterval($.proxy(this.updateProgress, this), 1000);

        $("body").addClass("playing");
        this.playing = true;
    },

    pause: function(){
        this.player.pause();

        this.pauseBtn.hide();
        this.playBtn.show();

        clearInterval(this.progressTimer);
        this.progressTimer = null;
    },

    stop: function(){
        this.pause();
        this.player.currentTime = 0;
        $("body").removeClass("playing");
        this.playing = false;

        clearInterval(this.progressTimer);
        this.progressTimer = null;

        this.updateProgress();
    },

    next: function(){
        if (this.currentSong.playlistIndex < this.playlist.length)
            this.play(this.playlist[this.currentSong.playlistIndex + 1]);
    },

    prev: function(){
        if (this.currentSong.playlistIndex > 0)
            this.play(this.playlist[this.currentSong.playlistIndex - 1]);
    }


};
