const { parentPort } = require('worker_threads');

parentPort.on('message', (chunk) => {
  try {
    const actions = {};

    chunk.forEach((log) => {
      if (!actions[log.action]) actions[log.action] = new Set();
      actions[log.action].add(log.userId);
    });

    // Convert Sets to Arrays for thread-safe messaging
    const sendActions = {};
    for (const [key, set] of Object.entries(actions)) {
      sendActions[key] = Array.from(set);
    }

    parentPort.postMessage({ actions: sendActions });
  } catch (err) {
    console.error('Worker error:', err);
  }
});
