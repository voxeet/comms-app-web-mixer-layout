// When a video stream is added to the conference
VoxeetSDK.conference.on("streamAdded", (participant, stream) => {
    console.log(`Event - streamAdded from ${participant.info.name} (${participant.id})`);

    if (stream.type === "ScreenShare") {
        addScreenShareNode(stream);
    } else if (stream.getVideoTracks().length) {
        // Only add the video node if there is a video track
        addVideoNode(participant, stream);
    }
});

// When a video stream is updated from the conference
VoxeetSDK.conference.on("streamUpdated", (participant, stream) => {
    console.log(`Event - streamUpdated from ${participant.info.name} (${participant.id})`);

    if (stream.type === "ScreenShare") return;

    if (stream.getVideoTracks().length) {
        // Only add the video node if there is a video track
        addVideoNode(participant, stream);
    } else {
        removeVideoNode(participant);
    }
});

// When a video stream is removed from the conference
VoxeetSDK.conference.on("streamRemoved", (participant, stream) => {
    console.log(`Event - streamRemoved from ${participant.info.name} (${participant.id})`);

    if (stream.type === "ScreenShare") {
        removeScreenShareNode();
    } else {
        removeVideoNode(participant);
    }
});



VoxeetSDK.videoPresentation.on("started", (vp) => {
    console.log(`Event - videoPresentation started ${vp.url}`);
    addVideoPlayer(vp.url);
    seekVideoPlayer(vp.timestamp);
});

VoxeetSDK.videoPresentation.on("paused", (vp) => {
    console.log("Event - videoPresentation paused");
    pauseVideoPlayer();
});

VoxeetSDK.videoPresentation.on("played", (vp) => {
    console.log("Event - videoPresentation played");
    playVideoPlayer();
});

VoxeetSDK.videoPresentation.on("sought", (vp) => {
    console.log("Event - videoPresentation sought");
    seekVideoPlayer(vp.timestamp);
});

VoxeetSDK.videoPresentation.on("stopped", () => {
    console.log("Event - videoPresentation stopped");
    removeVideoPlayer();
});
