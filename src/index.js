import '@babel/polyfill';
import http from 'http';

function requestHandler(req, res) {
  if (req.method === 'POST' && req.url === '/users') {
    const payloadData = [];
    req.on('data', (data) => {
      payloadData.push(data);
    });

    req.on('end', () => {
      if (payloadData.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'Payload should not be empty',
        }));
        return;
      }
      if (req.headers['content-type'] !== 'application/json') {
        res.writeHead(415, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'The "Content-Type" header must always be "application/json"',
        }));
        return;
      }
      try {
        const bodyString = Buffer.concat(payloadData).toString();
        JSON.parse(bodyString);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'Payload should be in JSON format',
        }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
  }
}
const server = http.createServer(requestHandler);
server.listen(8080);
