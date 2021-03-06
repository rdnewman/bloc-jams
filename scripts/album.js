var playButtonTemplate =
  '<a class="album-song-button">' +
  '  <span class="ion-play"></span>' +
  '</a>'
;
var pauseButtonTemplate =
  '<a class="album-song-button">' +
  '  <span class="ion-pause"></span>' +
  '</a>'
;
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + songLength + '</td>' +
    '</tr>'
  ;

  var onHover = function(event) {
    if (songNumber !== currentlyPlayingSongNumber) {
      $(this).find('.song-item-number').html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    if (songNumber !== currentlyPlayingSongNumber) {
      $(this).find('.song-item-number').html(songNumber);
    }
  };

  var clickHandler = function() {
    setSong(songNumber);
  };

  var $row = $(template);

  $row.hover(onHover, offHover);
  $row.click(clickHandler);

  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  }
};

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
       var seekBarFillRatio = this.getTime() / this.getDuration();
       var $seekBar = $('.seek-control .seek-bar');

       updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = Math.min(100, Math.max(0, (seekBarFillRatio * 100)));

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  var seekClickHandler = function($element) {
    var offsetX = event.pageX - $element.offset().left;
    var barWidth = $element.width();
    var seekBarFillRatio = offsetX / barWidth;

    updateSeekPercentage($element, seekBarFillRatio);

    var parentClass = $element.parent().attr('class');
    if (parentClass === 'seek-control') {
      seek(currentSoundFile.getDuration() * seekBarFillRatio);
    }
    else if (parentClass === 'control-group volume') {
      setVolume(100.0 * seekBarFillRatio);
    } else {
      console.error('Unexpected seek bar class!');
    }
  };

  $seekBars.click( function() {
    seekClickHandler($(this));
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    $(document).bind('mousemove.thumb', seekClickHandler($(this).parent()));

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var updatePlayerBarSong = function() {
  var $parentElement = $('.currently-playing');
  var $playerBarButton = $('.main-controls .play-pause');

  if (currentlyPlayingSongNumber === null) {
    $parentElement.find('.song-name').empty();
    $parentElement.find('.artist-song-mobile').empty();
    $parentElement.find('.artist-name').empty();
    $playerBarButton.html(playerBarPlayButton);

  } else {
    $parentElement.find('.song-name').text(currentSongFromAlbum.name);
    $parentElement.find('.artist-song-mobile').text(currentSongFromAlbum.name + ' - ' + currentAlbum.artist);
    $parentElement.find('.artist-name').text(currentAlbum.artist);
    if (currentSoundFile && currentSoundFile.isPaused()) {
      $playerBarButton.html(playerBarPlayButton);
    } else {
      $playerBarButton.html(playerBarPauseButton);
    }
  }
};

var setSong = function(newNumber) {
  var $newRow = $('[data-song-number="' + newNumber + '"]').parent();
  var $songNumberField = $newRow.find('.song-item-number');

  if (currentlyPlayingSongNumber !== null) {
    var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
  }

  if (currentlyPlayingSongNumber === newNumber) {
    if (currentSoundFile.isPaused()) {
      $songNumberField.html(pauseButtonTemplate);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
    } else {
      $songNumberField.html(playButtonTemplate);
      currentSoundFile.pause();
    }
  }
  else if (currentlyPlayingSongNumber !== newNumber) {
    if (currentSoundFile) {
      currentSoundFile.stop();
    }

    $songNumberField.html(pauseButtonTemplate);
    currentlyPlayingSongNumber = newNumber;
    currentSongFromAlbum = currentAlbum.songs[newNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: [ 'mp3' ],
      preload: true
    });

    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
  }

  updateSeekPercentage($('.control-group.volume').find('.seek-bar'), (currentVolume / 100.0));
  setVolume(currentVolume);
  updatePlayerBarSong();
};

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var nextSong = function() {
  var nextSong = 1;
  if ((currentlyPlayingSongNumber !== null) &&
      (currentlyPlayingSongNumber < currentAlbum.songs.length)) {
    nextSong = currentlyPlayingSongNumber + 1;
  }
  setSong(nextSong);
};
var $nextButton = $('.main-controls .next');

var previousSong = function() {
  var prevSong = currentAlbum.songs.length;
  if ((currentlyPlayingSongNumber !== null) &&
      (currentlyPlayingSongNumber > 1)) {
    prevSong = currentlyPlayingSongNumber - 1;
  }
  setSong(prevSong);
};
var $previousButton = $('.main-controls .previous');

var togglePlayFromPlayerBar = function() {
  if (currentlyPlayingSongNumber) {
    setSong(currentlyPlayingSongNumber);
  } else {
    setSong(1);
  }
};
var $togglePlayButton = $('.main-controls .play-pause');

$(document).ready( function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();

  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $togglePlayButton.click(togglePlayFromPlayerBar);
});
