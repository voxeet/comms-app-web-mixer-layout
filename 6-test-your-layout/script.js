// Initialize the SDK with the access token
const initializeVoxeetSDK = () => {
    // Load the settings injected by the mixer
    const accessToken = $("#accessToken").val();
    const refreshToken = $("#refreshToken").val();
    const refreshUrl = $("#refreshUrl").val();

    // Reference: https://dolby.io/developers/interactivity-apis/client-sdk/reference-javascript/voxeetsdk#static-initializetoken
    VoxeetSDK.initializeToken(accessToken, () =>
        fetch(refreshUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: { refresh_token: refreshToken }
        }).then(d => d.json().access_token)
    );
};

$("#joinConference").click(() => {
    // Initialize the SDK
    initializeVoxeetSDK();

    // Load the settings injected by the mixer
    const conferenceId = $("conferenceId").val();
    const thirdPartyId = $("thirdPartyId").val();
    const layoutType = $("layoutType").val();

    const mixer = {
        name: "Mixer",
        externalId: "Mixer_" + layoutType,
        thirdPartyId: thirdPartyId,
    };

    const joinOptions = {
        constraints: {
            video: false,
            audio: false
        },
        mixing: {
            enabled: true
        },
        userParams: {},
        audio3D: false
    };
    
    // Open a session for the mixer
    VoxeetSDK.session.open(mixer)
        .then(() => VoxeetSDK.conference.fetch(conferenceId))
        // Join the conference
        .then((conference) => VoxeetSDK.conference.join(conference, joinOptions))
        .catch((err) => console.log(err));
});

$("#replayConference").click(() => {
    // Initialize the SDK
    initializeVoxeetSDK();

    // Load the settings injected by the mixer
    const conferenceId = $("conferenceId").val();
    const thirdPartyId = $("thirdPartyId").val();
    const layoutType = $("layoutType").val();

    const mixer = {
        name: "Mixer",
        externalId: "Mixer_" + layoutType,
        thirdPartyId: thirdPartyId
    };
    
    // Open a session for the mixer
    VoxeetSDK.session.open(mixer)
        .then(() => VoxeetSDK.conference.fetch(conferenceId))
        // Replay the conference from the begining
        .then((conference) => VoxeetSDK.conference.replay(conference, 0, { enabled: true}))
        .catch((err) => console.log(err));
});


// Add the video stream to the web page
const addVideoNode = (participant, stream) => {
    let participantNode = $('#participant-' + participant.id);

    if (!participantNode.length) {
        participantNode = $('<div />')
            .attr('id', 'participant-' + participant.id)
            .addClass('container')
            .appendTo('#videos-container');

        $('<video />')
            .attr('autoplay', 'autoplay')
            .attr('muted', true)
            .appendTo(participantNode);

        // Add a temporary banner with the name of the participant
        let name = $('<p />').text(participant.info.name);
        let bannerName = $('<div />')
            .addClass('name-banner')
            .append(name)
            .appendTo(participantNode);

        // Remove the banner after 15 seconds
        setInterval(() => bannerName.remove(), 15000);
    }

    // Attach the stream to the video element
    navigator.attachMediaStream(participantNode.find('video').get(0), stream);
};

// Remove the video stream from the web page
const removeVideoNode = (participant) => {
    $('#participant-' + participant.id).remove();
};


// Add a screen share stream to the web page
const addScreenShareNode = (stream) => {
    let screenshareNode = $('<div />')
        .attr('id', 'screenshare')
        .appendTo('body');

    let container = $('<div />')
        .addClass('container')
        .appendTo(screenshareNode);

    let video = $('<video />')
        .attr('autoplay', 'autoplay')
        .appendTo(container);

    // Attach the stream to the video element
    navigator.attachMediaStream(video.get(0), stream);
}

// Remove the screen share stream from the web page
const removeScreenShareNode = () => {
    $('#screenshare').remove();
}


// Add a Video player to the web page
const addVideoPlayer = (videoUrl) => {
    $('<video />')
        .attr('id', 'video-url-player')
        .attr('src', videoUrl)
        .attr('autoplay', 'autoplay')
        .attr('playsinline', 'true')
        .appendTo('body');
};

// Move the cursor in the video
const seekVideoPlayer = (timestamp) => {
    $('#video-url-player')[0].currentTime = timestamp;
};

// Pause the video
const pauseVideoPlayer = () => {
    $('#video-url-player')[0].pause();
};

// Play the video
const playVideoPlayer = () => {
    $('#video-url-player')[0].play();
};

// Remove the Video player from the web page
const removeVideoPlayer = () => {
    $('#video-url-player').remove();
};


/*
 * Let the mixer know when the conference has ended.
 */
const onConferenceEnded = () => {
    $('#conferenceStartedVoxeet').remove();
    $('body').append('<div id="conferenceEndedVoxeet"></div>');
};

VoxeetSDK.conference.on("left", onConferenceEnded);
VoxeetSDK.conference.on("ended", onConferenceEnded);

$(document).ready(() => {
    const layoutType = $("layoutType").val();
    if (layoutType === "stream" || layoutType === "hls") {
        // Display the live message for the live streams
        $('#live').removeClass('hide');
    }

    // Inform the mixer that the application is ready to start
    $("<div />").attr("id", "conferenceStartedVoxeet").appendTo("body");


    // Insert your consumer key, secret and conference id
    const consumerKey = "";
    const consumerSecret = "";
    const conferenceId = "";

    VoxeetSDK.initialize(consumerKey, consumerSecret);

    const mixer = { name: "Test", externalId: "Test" };
    const joinOptions = { constraints: { video: false, audio: false } };
    
    // Open a session for the mixer
    VoxeetSDK.session.open(mixer)
        .then(() => VoxeetSDK.conference.fetch(conferenceId))
        // Join the conference
        .then((conference) => VoxeetSDK.conference.join(conference, joinOptions))
        .catch((err) => console.log(err));
});