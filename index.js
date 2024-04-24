const express = require('express');
const checkApiStatus = require('./routes/apiStatus');
const appSettingsModel = require('./models/appSettingsModel');

const app = express();
// Load app settings from appsettings.json
const appSettings = appSettingsModel.loadAppSettings();

const port = appSettings.port; // Change the port as needed

// Route to check API status

checkApiStatus(appSettings.apiUrlConfig, appSettings.teamsWebhookURL, appSettings.mentionedUsers);
console.log('API status check initiated.');



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});