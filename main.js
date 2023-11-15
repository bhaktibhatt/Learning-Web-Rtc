let peerConnection;
let localStream; // save audio and videos of client in these variables
let remoteStream;
let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'] // stun 
        }
    ]
}
let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio:false})
    document.getElementById('user-1').srcObject = localStream
}
let createOffer = async() => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track,localStream)
    })

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    document.getElementById('offer-sdp').value = JSON.stringify(offer)
}
init()

document.getElementById('create-offer').addEventListener('click', createOffer)