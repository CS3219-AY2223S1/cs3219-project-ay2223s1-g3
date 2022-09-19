import React, { useState, useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";

import "react-chat-widget/lib/styles.css";

function PopupChat({ socket }) {
  useEffect(() => {
    socket.on("send-chat-message", (message) => {
      addResponseMessage(message.message);
    });
  }, []);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    socket.emit("send-chat-message", newMessage);
    //addResponseMessage(newMessage);
  };

  return (
    <div>
      <Widget
        title={"Discuss here"}
        subtitle={"Communication is Key"}
        resizable
        emojis={true}
        handleNewUserMessage={handleNewUserMessage}
      />
    </div>
  );
}

export default PopupChat;
