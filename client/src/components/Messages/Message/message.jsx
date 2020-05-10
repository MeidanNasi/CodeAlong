import React, { useEffect, useState } from "react";
import "./message.css";

const Message = ({ data }) => {
  const [time, setTime] = useState("");
  useEffect(() => { 
    setTime(new Date().toLocaleTimeString());
  }, []);
  return (
    <div className='message-container'>
      <p>{data}</p>
      <span className="time-right">{time}</span>
    </div>
  );
};

export default Message;
