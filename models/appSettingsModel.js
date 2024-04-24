const fs = require('fs');

const appSettingsFile = 'appsettings.json';

const loadAppSettings = () => {
  const rawData = fs.readFileSync(appSettingsFile);
  return JSON.parse(rawData);
};

module.exports = {
  loadAppSettings,
};
