import io from 'socket.io-client';

const socket = io('http://localhost:5000'); //change the port to the one you are using for your server
//const socket = io('http://140.109.80.228:5000');
export default socket;