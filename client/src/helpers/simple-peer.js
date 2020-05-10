import Peer from "simple-peer";
import {
  REACT_APP_STUN_SERVERS,
  REACT_APP_TURN_SERVERS,
  REACT_APP_TURN_USERNAME,
  REACT_APP_TURN_CREDENCIAL,
} from "../config.json";
export default class VideoCall {
  peer = null;
  init = (stream, initiator) => {
    this.peer = new Peer({
      initiator: initiator,
      stream: stream,
      trickle: false,
      reconnectTimer: 1000,
      iceTransportPolicy: "relay",
      config: {
        iceServers: [
          { urls: REACT_APP_STUN_SERVERS.split(",") },
          {
            urls: REACT_APP_TURN_SERVERS.split(","),
            username: REACT_APP_TURN_USERNAME,
            credential: REACT_APP_TURN_CREDENCIAL,
          },
        ],
      },
    });
    return this.peer;
  };
  connect = (otherId) => {
    this.peer.signal(otherId);
  };
}
