import React, { Fragment, useState } from "react";
import shortId from "shortid";

import "./createRoom.css";

const goToRoom = (history, roomId) => {
  history.push(`/${roomId}`);
};

export function CreateRoom({ history }) {
  let [roomId, setRoomId] = useState(shortId.generate());

  return (
    <Fragment>
      <div className="landing">
        <div className="landing-header">
          <label>CodeAlong.</label>
          <p>
            {" "}
            P2P system for chat, video, audio and screen sharing,
            <br /> All you need is to create a room and send the url to your
            friend.{" "}
          </p>
          <p id="thateasy">That easy.</p>

          <form>
            <label id="form-label">Room id:</label>
            <input
              className="enter-room-input"
              type="text"
              value={roomId}
              placeholder="Room id"
              onChange={(event) => {
                setRoomId(event.target.value);
              }}
            />
            <button
              className="landing-button"
              onClick={() => {
                goToRoom(history, roomId);
              }}
            >
              Create room &rarr;
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
