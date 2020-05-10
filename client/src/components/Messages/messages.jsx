import React from "react";
import "./messages.css";
import Message from "./Message/message";

const Messages = ({ messages }) => {
  return (
    <div className="messages-container">
      {messages.map((message, i) => (
        <div key={i}>
          <Message data={message} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
