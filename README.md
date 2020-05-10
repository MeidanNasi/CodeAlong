# CodeAlong - Realtime Video Chat  

https://codealong.netlify.app

CodeAlong is a peer to peer realtime media streaming application for code meetings, enables video, audio, messages and screen sharing using WebRTC, socket.io and socket.io-client.
Project built with ReactJs and NodeJs.

![Image 1](https://github.com/MeidanNasi/CodeAlong/screenshot.png)
## Usage (locally):

1. clone/download.
2. create your turn account here:  http://numb.viagenie.ca/cgi-bin/numbacct
3. fill up your details in client/src/config.json
4. Install dependencies for each dir (client/server): `npm install`.
5. Fire up the server from server dir: `node server.js`.
6. Fire up the client from client dir: `npm start`.
7. Point your browser to: `http://localhost:3000`.
8. Create room and open a new tab with same url.

## Note:
for deployment, client side must support HTTPS for media permmisions.

