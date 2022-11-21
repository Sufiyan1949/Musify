let track_art = document.querySelectorAll(".songDetailsCtnr>.sImg");
let track_name = document.querySelectorAll(".songDetailsCtnr>.texts>.sTitle");
let track_artist = document.querySelectorAll(".songDetailsCtnr>.texts>.sArtist");

let playpause_btn = document.querySelectorAll(".play_pause");
let next_btn = document.querySelector(".controlerCtnr>.btnsCtnr>.forward");
let prev_btn = document.querySelector(".controlerCtnr>.btnsCtnr>.backward");

let seek_slider = document.querySelector(".controlerCtnr>.progressCtnr>.slider");
let volume_slider = document.querySelector(".volumeCtnr>#volume");
let curr_time = document.querySelector(".controlerCtnr>.progressCtnr>.currentTime");
let total_duration = document.querySelector(".controlerCtnr>.progressCtnr>.totalTime");
document.querySelector(".volumeCtnr>.muteBtn").onclick = function (){
    if (volume_slider.value != 0) {
        curr_track.volume = 0
        volume_slider.value = 0;
    } else {
        curr_track.volume = 0.5;
        volume_slider.value = 50;
    }
}

let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();
    curr_track.src = playList[track_index].path;
    curr_track.load();

    track_art.forEach(e => e.style.backgroundImage = "url(" + playList[track_index].simgpath + ")");
    track_name.forEach(e => e.textContent = playList[track_index].title);
    track_artist.forEach(e => e.textContent = playList[track_index].artist);

    updateTimer = setInterval(seekUpdate, 1000);
    curr_track.addEventListener("ended", nextTrack);
    playTrack();
}


function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

playpause_btn.forEach( btn => {
    btn.onclick = function () {
        if (!isPlaying) playTrack();
        else pauseTrack();
    }
 });


function playTrack() {
    curr_track.play();
    isPlaying = true;
    playpause_btn.forEach(btn => btn.src = 'assets/ic_pause.svg');
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    playpause_btn.forEach(btn => btn.src = 'assets/ic_play.svg');
}

next_btn.addEventListener("click", nextTrack);
function nextTrack() {
    if (track_index < playList.length - 1)
        track_index += 1;
    else track_index = 0;
    loadTrack(track_index);
    playTrack();
}

prev_btn.onclick = function prevTrack() {
    if (track_index > 0)
        track_index -= 1;
    else track_index = playList.length;
    loadTrack(track_index);
    playTrack();
}

seek_slider.onchange = function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

volume_slider.onchange = function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);

        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}


