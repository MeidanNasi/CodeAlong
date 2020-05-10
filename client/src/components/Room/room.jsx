import React, { Fragment } from "react";
import io from "socket.io-client";
import VideoCall from "../../helpers/simple-peer";
import { getDisplayStream } from "../../helpers/media-access";
import {
  ShareScreenIcon,
  MicOnIcon,
  MicOffIcon,
  CamOnIcon,
  CamOffIcon,
  ChatIcon,
} from "../Icons/Icons";
import Sidenav from "../Sidenav/sidenav";
import Chat from "../Chat/chat";
import { REACT_APP_SIGNALING_SERVER } from "../../config.json";
import "./room.css";

class Room extends React.Component {
  constructor() {
    super();
    this.state = {
      localStream: {},
      remoteStreamUrl: "",
      streamUrl: "",
      initiator: false,
      peer: {},
      full: false,
      connecting: false,
      waiting: true,
      micState: true,
      camState: true,
      screenSelected: false,
      id: "",
      openChat: false,
      shareScreenDisabled: true,
    };
  }
  videoCall = new VideoCall();

  componentDidMount() {
    const socket = io(REACT_APP_SIGNALING_SERVER, {
      secure: true,
      reconnect: true,
      rejectUnauthorized: false,
    });

    const component = this;
    this.setState({ socket });
    const { roomId } = this.props.match.params;
    this.setState({ id: roomId });
    this.getUserMedia().then(() => {
      // user first joins
      socket.emit("join", { roomId: roomId });
    });

    socket.on("init", () => {
      // in case he's the 1st one in this room he's the initiator
      component.setState({ initiator: true });
    });
    socket.on("ready", () => {
      // if he's the 2nd one who is in this room
      component.enter(roomId);
    });
    socket.on("desc", (data) => {
      if (data.type === "offer" && component.state.initiator) return;
      if (data.type === "answer" && !component.state.initiator) return;
      component.call(data);
    });
    socket.on("disconnected", () => {
      component.setState({ initiator: true });
    });
    socket.on("full", () => {
      component.setState({ full: true });
    });
  }
  enter = (roomId) => {
    this.setState({ connecting: true, waiting: false });
    const peer = this.videoCall.init(
      this.state.localStream,
      this.state.initiator
    );
    this.setState({ peer });

    peer.on("signal", (data) => {
      const signal = {
        room: roomId,
        desc: data,
      };
      this.state.socket.emit("signal", signal);
    });
    peer.on("stream", (stream) => {
      // other user's stream...
      this.remoteVideo.srcObject = stream;
      this.setState({
        connecting: false,
        waiting: false,
        shareScreenDisabled: false,
      });
    });
    peer.on("error", function (err) {
      console.log(err);
    });
  };

  call = (otherId) => {
    this.videoCall.connect(otherId);
  };

  // getting local video
  getUserMedia(cb) {
    return new Promise((resolve, reject) => {
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 },
        },
        audio: true,
      };
      navigator.mediaDevices.getUserMedia(op).then((stream) => {
        this.setState({ streamUrl: stream, localStream: stream });
        this.localVideo.srcObject = stream;
        resolve();
      });
    });
  }

  // enabling/disabling local audio
  setAudioLocal() {
    if (this.state.localStream.getAudioTracks().length > 0) {
      this.state.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    this.setState({
      micState: !this.state.micState,
    });
  }

  // enabling/disabling local audio
  setVideoLocal() {
    if (this.state.localStream.getVideoTracks().length > 0) {
      this.state.localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    this.setState({
      camState: !this.state.camState,
    });
  }

  // sharing screen
  getDisplay() {
    getDisplayStream().then((stream) => {
      stream.oninactive = () => {
        this.state.peer.removeStream(this.state.localStream);
        this.getUserMedia().then(() => {
          this.state.peer.addStream(this.state.localStream);
        });
      };
      this.setState({
        streamUrl: stream,
        localStream: stream,
        screenSelected: !this.state.screenSelected,
      });
      this.localVideo.srcObject = stream;
      this.state.peer.addStream(stream);
    });
  }

  // displays full room when room contains 2 users
  renderFull = () => {
    if (this.state.full) {
      return <p>The room is full</p>;
    }
  };

  render() {
    return (
      <Fragment>
        <div className="room">
          <p>{this.state.error}</p>
          {this.state.connecting && (
            <div className="status">
              <p>Establishing connection...</p>
            </div>
          )}

          {this.state.waiting && (
            <div className="status">
              <p>Waiting for someone...</p>
            </div>
          )}

          {this.renderFull()}

          <div className="container">
            <Sidenav />

            <div className="video-container">
              <video
                autoPlay
                controls
                id="localVideo"
                muted
                ref={(video) => (this.localVideo = video)}
              />

              <video
                controls
                autoPlay
                className={`${
                  this.state.connecting || this.state.waiting ? "hide" : ""
                }`}
                id="remoteVideo"
                ref={(video) => (this.remoteVideo = video)}
              />
            </div>

            {this.state.openChat && (
              <div className="chat-container">
                <Chat socket={this.state.socket} id={this.state.id} />
              </div>
            )}

            <div className="navbar">
              <div className="controls">
                <div className="tooltip">
                  <span className="tooltiptext">Chat</span>
                  <button
                    className="control-btn"
                    onClick={() =>
                      this.setState({ openChat: !this.state.openChat })
                    }
                  >
                    <ChatIcon />
                  </button>
                </div>

                <div className="tooltip">
                  <span className="tooltiptext">Screen</span>
                  <button
                    disabled={this.state.shareScreenDisabled}
                    className="control-btn"
                    onClick={() => {
                      this.getDisplay();
                    }}
                  >
                    <ShareScreenIcon />
                  </button>
                </div>

                <div className="tooltip">
                  <span className="tooltiptext">Mic</span>
                  <button
                    className="control-btn"
                    onClick={() => {
                      this.setAudioLocal();
                    }}
                  >
                    {this.state.micState ? (
                      <MicOnIcon></MicOnIcon>
                    ) : (
                      <MicOffIcon></MicOffIcon>
                    )}
                  </button>
                </div>

                <div className="tooltip">
                  <span className="tooltiptext">Cam</span>
                  <button
                    className="control-btn"
                    onClick={() => {
                      this.setVideoLocal();
                    }}
                  >
                    {this.state.camState ? (
                      <CamOnIcon></CamOnIcon>
                    ) : (
                      <CamOffIcon></CamOffIcon>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Room;
