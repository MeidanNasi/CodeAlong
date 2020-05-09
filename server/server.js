
const app = require("express")();
// const https = require('https');
// const fs = require('fs');

// const httpsServer = https.createServer({
//   key: fs.readFileSync('/etc/letsencrypt/live/justcodealongwithme.live/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/justcodealongwithme.live/fullchain.pem'),
// }, app);

const server = require("http").Server(app);
const io = require("socket.io")(server);

//const io = require("socket.io")(httpsServer);

io.on("connection", function(socket) {
  console.log("connected..");
  socket.on("join", function(data) {
    socket.join(data.roomId);
    socket.room = data.roomId;
    const sockets = io.of("/").in().adapter.rooms[data.roomId];
    if (sockets.length === 1) {
      socket.emit("init");
    } else {
      if (sockets.length === 2) {
        io.to(data.roomId).emit("ready");
      } else {
        socket.room = null;
        socket.leave(data.roomId);
        socket.emit("full");
      }
    }
  });

  socket.on("signal", data => {
    io.to(data.room).emit("desc", data.desc);
  });

  socket.on("sendMessage", (data, callback) => {
    io.to(data.id).emit("message", data.message);
    callback();
  });

  socket.on("disconnect", () => {
    const roomId = Object.keys(socket.adapter.rooms)[0];
    if (socket.room) {
      io.to(socket.room).emit("disconnected");
    }
  });
});

server.listen(8080, () => console.log("listening on port 8080"));

// httpsServer.listen(443, () => {
//   console.log('HTTPS Server running on port 443');
// });
