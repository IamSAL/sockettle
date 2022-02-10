module.exports = (WSS, ws, message) => {
  ws.send(JSON.stringify({ received: message }));
  WSS.broadcast(JSON.stringify(message));
};
