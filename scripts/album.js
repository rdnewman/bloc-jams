// Example Album
var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { name: 'Blue', length: '4:26' },
    { name: 'Green', length: '3:14' },
    { name: 'Red', length: '5:01' },
    { name: 'Pink', length: '3:21'},
    { name: 'Magenta', length: '2:15'}
  ]
};

// Another Example Album
var albumMarconi = {
  name: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { name: 'Hello, Operator?', length: '1:01' },
    { name: 'Ring, ring, ring', length: '5:01' },
    { name: 'Fits in your pocket', length: '3:21'},
    { name: 'Can you hear me now?', length: '3:14' },
    { name: 'Wrong phone number', length: '2:15'}
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + songLength + '</td>' +
    '</tr>'
  ;

  return template;
};

var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.name;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';

  for (i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
  }
};

/********************************************/
/*  Should move to utilities.js...
/*/
var hasSingleClass = function( elem, klass ) {
  return (' ' + elem.className + ' ').indexOf(' ' + klass + ' ') > -1;
};

var findParentByClassName = function(element, targetClassName) {
  var currElement = element;
  do {
    currElement = currElement.parentNode;
    if (currElement === document) {
      return null;
    }  // don't go too far in case it can't be found!
  }
  while (!(hasSingleClass(currElement, targetClassName)));
  return currElement;
};

var findChildByClassName = function(element, targetClassName) {
  // Use breadth-first search...
  var idx;

  // check direct children
  for (idx = 0; idx < element.children.length; idx++) {
    if (hasSingleClass(element.children[idx], targetClassName)) {
      return element.children[idx];
    }
  }

  // recurse to search descendents
  for (idx = 0; idx < element.children.length; idx++) {
    var descendent = findChildByClassName(element.children[idx], targetClassName);
    if (null !== descendent) {
      return descendent;
    }
  }

  return null;
};

/*/
/********************************************/

var getSongItemRichard = function(element) {
  var songItem;
  var target = 'song-item-number';

  // check self
  if (hasSingleClass(element, target)) {
    return element;     // this case probably never occurs because of hover!
  }

  // check parent
  songItem = findParentByClassName(element, target);

  // can't be efficient at this point...
  // just check among all children of common ancestor
  if (null === songItem) {
    var commonAncestor;
    var commonTarget = 'album-view-song-item';
    if (hasSingleClass(element, commonTarget)) {
      commonAncestor = element;
    } else {
      commonAncestor = findParentByClassName(element, commonTarget);
    }
    songItem = findChildByClassName(commonAncestor, target);
  }

  return songItem;
};

// Oh, I guess you wanted something less generic/simpler... that's why you wanted switch!
// Not sure this one is any faster (lots of compares here too)
var getSongItemBloc = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');

    case 'album-view-song-item':
      return element.querySelector('.song-item-number');

    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');

    case 'song-item-number':
      return element;

    default:
      return;
  }
};

var getSongItem = getSongItemRichard;     // switch between the two easily
//var getSongItem = getSongItemBloc;

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);
  var songItemNumber = songItem.getAttribute('data-song-number');

  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItemNumber;
  }
  else if (currentlyPlayingSong === songItemNumber) {
    songItem.innerHTML = playButtonTemplate;
    currentlyPlayingSong = null;
  }
  else if (currentlyPlayingSong !== songItemNumber) {
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');

    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItemNumber;
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
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
var currentlyPlayingSong = null;   // Store state of playing songs

window.onload = function() {
  setCurrentAlbum(albumPicasso);

  songListContainer.addEventListener('mouseover', function(event) {
    if (event.target.parentElement.className === 'album-view-song-item') {
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');
      
      if (songItemNumber !== currentlyPlayingSong) {
        songItem.innerHTML = playButtonTemplate;
      }
    }
  });

  for (i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      if (songItemNumber !== currentlyPlayingSong) {
         songItem.innerHTML = songItemNumber;
      }
    });

    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
};
