// Wait for Cordova to load
//
//document.addEventListener("deviceready", onDeviceReady, false);
//.addEventListener("click", onDeviceReady());

// Cordova is ready
//
document.getElementById("playRadio").addEventListener("click", function() {
    alert('click');
    onDeviceReady();

});

function onDeviceReady() {
   alert('play radio');
    playAudio("http://stream.zeno.fm/qd8hws5efseuv");
}

// Audio player
//
var my_media = null;
var mediaTimer = null;

// Play audio
//
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError, status);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    alert("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }

    var counter = 0;
    var timerDur = setInterval(function() {
        counter = counter + 100;
        if (counter > 2000) {
            clearInterval(timerDur);
        }
        var dur = my_media.getDuration();
        if (dur > 0) {
            clearInterval(timerDur);
            document.getElementById('audio_duration').innerHTML = (dur) + " sec";
        }
    }, 100);
}
//Audio Status
function status(mediaStatus) {
    switch (mediaStatus) {
        case 0:
            document.getElementById('audio_status').innerHTML = "None Media";
            break;
        case 1:
            document.getElementById('audio_status').innerHTML = "Starting Media";
            break;
        case 2:
            document.getElementById('audio_status').innerHTML = "Running Media";
            break;
        case 3:
            document.getElementById('audio_status').innerHTML = "Paused Media";
            break;
        case 4:
            document.getElementById('audio_status').innerHTML = "Stopped Media";
            break;
    }
}
// onSuccess Callback
//
function onSuccess() {
    alert("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Pause audio
//
function pauseAudio() {
    if (my_media)
        my_media.pause();
}

// Stop audio
//
function stopAudio() {
    if (my_media)
        my_media.stop();

    clearInterval(mediaTimer);
    mediaTimer = null;
}

// Resume Audio
function resumeAudio() {
    if (my_media)
        my_media.play();
}

//Seek Audio
function seekAudio(pos) {
    if (my_media)
        my_media.seekTo(pos);

    //setTimeout(function () {
    //    my_media.seekTo(10000);
    //}, 5000);
}

//Release Audio from RAM
function releaseAudio() {
    if (my_media)
        my_media.release();
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}


/*///////////////////////////////////////////////////////////////////////////////////*/