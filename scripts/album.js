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

// Another Example Album
var albumWhite = {
  name: 'Icky Thump',
  artist: 'White Stripes',
  label: 'Warner Bros.',
  year: '2007',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { name: 'Icky Thump', length: '4:15' },
    { name: "You Don't Know What Love Is [You Just Do As You're Told]", length: '3:54' },
    { name: '300 M.P.H. Torrential Outpour Blues', length: '5:29'},
    { name: 'Conquest', length: '2:48' },
    { name: 'Bone Broke', length: '3:14'},
    { name: 'Prickly Thorn, But Sweetly Worn', length: '3:06'},
    { name: 'St. Andrew [This Battle Is In The Air]', length: '1:48'},
    { name: 'Little Cream Soda', length: '3:44'},
    { name: 'Rag And Bone', length: '3:47'},
    { name: "I'm Slowly Turning Into You", length: '4:32'},
    { name: 'A Martyr For My Love For You', length: '4:19'},
    { name: 'Catch Hell Blues', length: '4:17'},
    { name: 'Effect And Cause', length: '3:00'},
    { name: 'Baby Brother (Non-Album Track)', length: '2:11' },
    { name: 'Tennessee Border [Live]', length: '2:11'},
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number">' + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + songLength + '</td>' +
    '</tr>'
  ;

  return template;
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
  albumTitle.firstChild.nodeValue = album.name;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';
  for (i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
  }
};

var selectNextAlbum = function() {
  var albums = [albumPicasso, albumMarconi, albumWhite];
  var currentName = albumTitle.firstChild.nodeValue;

  var element;
  do
    element = Math.floor((Math.random() * albums.length));
  while (albums[element].name == currentName);  // assure always different

  return albums[element];
};

window.onload = function() {
  setCurrentAlbum(albumWhite);

  albumImage.addEventListener('click', function() {
    setCurrentAlbum(selectNextAlbum());
  });
};
