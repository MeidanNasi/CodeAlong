import React, { useState, useEffect } from "react";
import Messages from "./../Messages/messages";
import Input from "./../Input/input";
import "./chat.css";

const Chat = ({ socket, id }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });
  }, []);

  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message, id }, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <Messages messages={messages} />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
