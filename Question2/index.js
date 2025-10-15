const fs = require('fs');
const { Worker } = require('worker_threads');
const os = require('os');
const path = require('path');

// Default parameters
let filePath = './data/user_logs.json';
let numWorkers = os.cpus().length;

// Parse CLI arguments
process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--file=')) filePath = arg.split('=')[1];
  if (arg.startsWith('--workers=')) numWorkers = parseInt(arg.split('=')[1], 10);
});

// Resolve file path
filePath = path.resolve(filePath);
console.log('Using file:', filePath);
console.log('Number of workers:', numWorkers);

let workers = [];
let results = [];
let totalLogs = 0;
let startTime;

// Helper: split array into chunks
function chunkArray(array, chunks) {
  const result = [];
  const size = Math.ceil(array.length / chunks);
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Read file and start processing
function processFile() {
  startTime = Date.now();
  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  let buffer = '';

  readStream.on('data', (chunk) => {
    buffer += chunk;
  });

  readStream.on('end', () => {
    let data;
    try {
      data = JSON.parse(buffer);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return;
    }

    totalLogs = data.length;
    const chunks = chunkArray(data, numWorkers);

    let completed = 0;
    const workerPath = path.join(process.cwd(), 'worker.js');

    chunks.forEach((chunk, index) => {
      const worker = new Worker(workerPath);
      workers.push(worker);

      worker.on('message', (msg) => {
        results.push(msg);
        completed++;
        if (completed === chunks.length) {
          aggregateResults();
        }
      });

      worker.on('error', (err) => {
        console.error(`Worker ${index} crashed:`, err);
      });

      worker.postMessage(chunk);
    });
  });

  readStream.on('error', (err) => {
    console.error('Error reading file:', err);
  });
}

// Aggregate worker results
function aggregateResults() {
  const actionSummary = {};
  const uniqueUsersSet = new Set();

  results.forEach((res) => {
    for (const [action, usersArray] of Object.entries(res.actions)) {
      if (!actionSummary[action]) actionSummary[action] = 0;
      const usersSet = new Set(usersArray);
      actionSummary[action] += usersSet.size;
      usersSet.forEach(u => uniqueUsersSet.add(u));
    }
  });

  const endTime = Date.now();
  const summary = {
    totalLogs,
    uniqueUsers: uniqueUsersSet.size,
    actionSummary,
    executionTimeMs: endTime - startTime
  };

  console.log(JSON.stringify(summary, null, 2));
}

processFile();