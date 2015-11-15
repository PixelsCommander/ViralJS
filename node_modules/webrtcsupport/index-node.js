// Once node.js gains a robust module integrating WebRTC that can
// be easily added to dependencies, we'll update this to expose it

module.exports = {
    support: false,
    supportRTCPeerConnection: false,
    supportVp8: false,
    supportGetUserMedia: false,
    supportDataChannel: false,
    supportWebAudio: false,
    supportMediaStream: false,
    supportScreenSharing: false,
    prefix: undefined,
    AudioContext: undefined,
    PeerConnection: undefined,
    SessionDescription: undefined,
    IceCandidate: undefined,
    MediaStream: undefined,
    getUserMedia: undefined
};
