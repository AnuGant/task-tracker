// A simple smoke test: start the server, hit GET /tasks, confirm it responds correctly.
const { spawn } = require('child_process');
const http = require('http');

const server = spawn('node', ['server.js']);

setTimeout(() => {
  http.get('http://localhost:3000/tasks', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      server.kill();
      if (res.statusCode !== 200) {
        console.error(`Test failed: expected status 200, got ${res.statusCode}`);
        process.exit(1);
      }
      try {
        const tasks = JSON.parse(data);
        if (!Array.isArray(tasks)) throw new Error('Response is not an array');
        console.log('Test passed: GET /tasks returned 200 with a valid array.');
        process.exit(0);
      } catch (err) {
        console.error('Test failed:', err.message);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    server.kill();
    console.error('Test failed: could not reach server —', err.message);
    process.exit(1);
  });
}, 1000);