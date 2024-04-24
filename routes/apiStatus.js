const net = require('net');
const teamsConfig = require('../config/teamsConfig');

let apiStatus = {};

const checkApiStatus = (apiUrlConfig, teamsWebhookURL, mentionedUsers) => {
  const checkAndUpdateStatus = async () => {
    for (const config of apiUrlConfig) {
      const { url, port } = config;
      const socket = new net.Socket();
      const previousStatus = apiStatus[url] || false;

      try {
        socket.connect(port, url, () => {
          console.log(Date())
          console.log(`Socket: Connected to ${url}. ${url} is ONLINE!`);
          socket.end(); // Close the socket immediately
        });

        socket.on('error', (err) => {
          console.log(Date())
          console.log(`Socket: ${url} is unreachable with error: ${err.message}. ${url} is OFFLINE!`);
          const newStatus = false;
          if (previousStatus !== newStatus) {
            apiStatus[url] = newStatus;
            teamsConfig(url, newStatus, null, teamsWebhookURL, mentionedUsers);
          }
        });

        // Wait for the socket to be connected or an error occurs
        await new Promise((resolve) => {
          socket.once('connect', resolve);
          socket.once('error', resolve);
        });

        const newStatus = true;
        if (previousStatus !== newStatus) {
          apiStatus[url] = newStatus;
          teamsConfig(url, newStatus, null, teamsWebhookURL, mentionedUsers);
        }
      } catch (error) {
        console.log(Date())
        console.log(`Socket error: ${error.message}`);
        const newStatus = false;
        if (previousStatus !== newStatus) {
          apiStatus[url] = newStatus;
          teamsConfig(url, newStatus, null, teamsWebhookURL, mentionedUsers);
        }
      }
    }
  };

  // Call the function initially to perform the first check
  checkAndUpdateStatus();

  // Schedule the function to run every 15 minutes
  const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
  setInterval(checkAndUpdateStatus, interval);
};

module.exports = checkApiStatus;
