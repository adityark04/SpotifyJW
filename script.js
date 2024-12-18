// Songs array - Make sure this is at the top
let songs = [
    { songName: "Memories", filePath: "Images/2.mp3", coverPath: "Images/j2.jpeg" },
    { songName: "I don't wanna know", filePath: "Images/1.mp3", coverPath: "Images/j1.jpeg" },
    { songName: "My Home", filePath: "Images/3.mp3", coverPath: "Images/j3.jpeg" },
    { songName: "Moonlight", filePath: "Images/6.mp3", coverPath: "Images/j5.jpeg" },
    { songName: "734", filePath: "Images/4.mp3", coverPath: "Images/j4.jpeg" },
    { songName: "Way too Many", filePath: "Images/5.mp3", coverPath: "Images/j6.jpeg" }
];

// Initializing the variables
let songIndex = 0;
let audioElement = new Audio(songs[songIndex].filePath);
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let timestampElement = document.getElementById('timestamp'); // Timestamp display
let songItems = Array.from(document.getElementsByClassName('songItem'));
let prevButton = document.querySelector('.fa-backward-step');
let nextButton = document.querySelector('.fa-forward-step');

// Format time to mm:ss
const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = "0" + secs; // Add leading zero if needed
    return `${minutes}:${secs}`;
};

// Update song details in the DOM
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Play or Pause when master play button is clicked
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
    }
});

// Listen to timeupdate event to sync progress bar and update timestamp
audioElement.addEventListener('timeupdate', () => {
    let currentTime = audioElement.currentTime;
    let totalTime = audioElement.duration;
    
    if (!isNaN(totalTime)) {
        // Update the timestamp display (current time / total time)
        timestampElement.innerText = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
    }

    let progress = parseInt((currentTime / totalTime) * 100);
    myProgressBar.value = progress;

    // Changing color with progress
    let progressPercent = progress + "%";
    myProgressBar.style.background = `linear-gradient(to right, #f72585 ${progressPercent}, #5a189a ${progressPercent})`;
});

// Update playback time when progress bar value changes
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Reset all play buttons to 'play' state
const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    });
};

// Update bottom song name
const updateBottomSongName = () => {
    const bottomSongName = document.querySelector('.songInfo .songName');
    bottomSongName.innerText = songs[songIndex].songName;
};

// Play the selected song
const playSong = () => {
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    updateBottomSongName();
};

// Handle next button
nextButton.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    makeAllPlays();
    playSong();
});

// Handle previous button
prevButton.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    makeAllPlays();
    playSong();
});

// Handle individual song selection
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, i) => {
    element.addEventListener('click', (e) => {
        if (audioElement.src !== songs[i].filePath) {
            makeAllPlays();
            songIndex = i;
            e.target.classList.remove('fa-play-circle');
            e.target.classList.add('fa-pause-circle');
            playSong();
        } else {
            // If the clicked song is already playing, toggle play/pause
            if (audioElement.paused) {
                audioElement.play();
                e.target.classList.remove('fa-play-circle');
                e.target.classList.add('fa-pause-circle');
            } else {
                audioElement.pause();
                e.target.classList.remove('fa-pause-circle');
                e.target.classList.add('fa-play-circle');
            }
        }
    });
});
