const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let drawings = [];

io.on('connection', (socket) => {
  // Enviar desenhos anteriores para o novo cliente
  drawings.forEach((drawing) => {
    socket.emit('draw', drawing);
  });

  socket.on('draw', (data) => {
    drawings.push(data);
    socket.broadcast.emit('draw', data);
  });

  socket.on('clear', () => {
    drawings = []; // Limpa o array de desenhos
    io.emit('clear'); // Emite o evento 'clear' para todos os clientes, incluindo o cliente atual
  });
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
