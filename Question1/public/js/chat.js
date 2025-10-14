const token = localStorage.getItem('token');
if (!token) window.location.href = '/login';

const socket = io({ auth: { token } });
const roomId = 'default-room'; // could be dynamic later

socket.emit('joinRoom', { roomId });

socket.on('connect', () => console.log('Connected to chat'));
socket.on('message', msg => {
  const div = document.createElement('div');
  div.textContent = `${msg.sender.email}: ${msg.content}`;
  document.getElementById('messages').appendChild(div);
});

document.getElementById('sendBtn').addEventListener('click', () => {
  const input = document.getElementById('messageInput');
  const content = input.value.trim();
  if (content) {
    socket.emit('message', { roomId, content });
    input.value = '';
  }
});
