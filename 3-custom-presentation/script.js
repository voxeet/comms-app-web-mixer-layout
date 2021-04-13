// Initialize the SDK with the access token
const initializeVoxeetSDK = () => {
    // Load the settings injected by the mixer
    const accessToken = $("#accessToken").val();
    const refreshToken = $("#refreshToken").val();
    const refreshUrl = $("#refreshUrl").val();

    // Reference: https://dolby.io/developers/interactivity-apis/client-sdk/reference-javascript/voxeetsdk#static-initializetoken
    VoxeetSDK.initializeToken(accessToken, () =>
        fetch(refreshUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: { refresh_token: refreshToken }
        })
            .then((data) => data.json())
            .then((json) => json.access_token)
    );
};

const joinConference = () => {
    // Initialize the SDK
    initializeVoxeetSDK();

    // Load the settings injected by the mixer
    const catToken = $("#catToken").val();
    const conferenceId = $("#conferenceId").val();
    const thirdPartyId = $("#thirdPartyId").val();
    const layoutType = $("#layoutType").val();

    const mixer = {
        name: "Mixer",
        externalId: "Mixer_" + layoutType,
        thirdPartyId: thirdPartyId,
    };

    const joinOptions = {
        conferenceAccessToken: (catToken && catToken.length > 0 ? catToken : null),
        constraints: {
            video: false,
            audio: false
        },
        mixing: {
            enabled: true
        },
        userParams: {}
    };
    
    // Open a session for the mixer
    VoxeetSDK.session.open(mixer)
        .then(() => VoxeetSDK.conference.fetch(conferenceId))
        // Join the conference
        .then((conference) => VoxeetSDK.conference.join(conference, joinOptions))
        .catch((err) => console.log(err));
};

const replayConference = () => {
    // Initialize the SDK
    initializeVoxeetSDK();

    // Load the settings injected by the mixer
    const catToken = $("#catToken").val();
    const conferenceId = $("#conferenceId").val();
    const thirdPartyId = $("#thirdPartyId").val();
    const layoutType = $("#layoutType").val();

    const mixer = {
        name: "Mixer",
        externalId: "Mixer_" + layoutType,
        thirdPartyId: thirdPartyId
    };

    const replayOptions = {
        conferenceAccessToken: (catToken && catToken.length > 0 ? catToken : null),
        offset: 0
    };
    
    // Open a session for the mixer
    VoxeetSDK.session.open(mixer)
        .then(() => VoxeetSDK.conference.fetch(conferenceId))
        // Replay the conference from the beginning
        .then((conference) => VoxeetSDK.conference.replay(conference, replayOptions, { enabled: true}))
        .catch((err) => console.log(err));
};


// Add the video stream to the web page
const addVideoNode = (participant, stream) => {
    let participantNode = $("#participant-" + participant.id);

    if (!participantNode.length) {
        participantNode = $("<div />")
            .attr("id", "participant-" + participant.id)
            .addClass("container")
            .appendTo("#videos-container");

        $("<video autoplay playsInline muted />")
            .appendTo(participantNode);

        // Add a temporary banner with the name of the participant
        let name = $("<p />").text(participant.info.name);
        let bannerName = $("<div />")
            .addClass("name-banner")
            .append(name)
            .appendTo(participantNode);

        // Remove the banner after 15 seconds
        setInterval(() => bannerName.remove(), 15000);
    }

    // Attach the stream to the video element
    navigator.attachMediaStream(participantNode.find("video").get(0), stream);
};

// Remove the video stream from the web page
const removeVideoNode = (participant) => {
    $("#participant-" + participant.id).remove();
};


// Add a screen share stream to the web page
const addScreenShareNode = (stream) => {
    let screenshareNode = $("<div />")
        .attr("id", "screenshare")
        .appendTo("body");

    let container = $("<div />")
        .addClass("container")
        .appendTo(screenshareNode);

    let videoNode = $("<video autoplay playsInline muted />")
        .appendTo(container);

    // Attach the stream to the video element
    navigator.attachMediaStream(videoNode.get(0), stream);
};

// Remove the screen share stream from the web page
const removeScreenShareNode = () => {
    $("#screenshare").remove();
};


// Add a Video player to the web page
const addVideoPlayer = (videoUrl) => {
    $("<video autoplay playsinline />")
        .attr("id", "video-url-player")
        .attr("src", videoUrl)
        .appendTo("body");
};

// Move the cursor in the video
const seekVideoPlayer = (timestamp) => {
    $("#video-url-player")[0].currentTime = timestamp;
};

// Pause the video
const pauseVideoPlayer = () => {
    $("#video-url-player")[0].pause();
};

// Play the video
const playVideoPlayer = () => {
    $("#video-url-player")[0].play();
};

// Remove the Video player from the web page
const removeVideoPlayer = () => {
    $("#video-url-player").remove();
};


/*
 * Let the mixer know when the conference has ended.
 */
const onConferenceEnded = () => {
    $("#conferenceStartedVoxeet").remove();
    $("body").append('<div id="conferenceEndedVoxeet"></div>');
};

VoxeetSDK.conference.on("left", onConferenceEnded);
VoxeetSDK.conference.on("ended", onConferenceEnded);

$(document).ready(() => {
    $("#joinConference").click(joinConference);
    $("#replayConference").click(replayConference);
    
    // Inform the mixer that the application is ready to start
    $("<div />").attr("id", "conferenceStartedVoxeet").appendTo("body");

    // Temporary code used to display two participants and a screenshare
    addVideoNode({id: "01", info: {name: "Guest 01"}}, null);
    addVideoNode({id: "02", info: {name: "Guest 02"}}, null);
    addScreenShareNode(null);
});