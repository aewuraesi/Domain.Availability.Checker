const axios = require('axios');

const sendMessage = async (url, status, statusCode, teamsWebhookURL, mentionedUsers) => {
  const message = status ? `Connection to ${url} **SUCCESSFUL**` : `Connection to ${url} **FAILED**`;
  const message1 = status ? `Status is **ONLINE**!` : `Status is is **OFFLINE**!`;
  //console.log(message);
  try {
    const payload = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: {
            type: 'AdaptiveCard',
            body: [
              {
                type: 'TextBlock',
                size: "Medium",
                width: "Full",
                weight: 'Bolder',
                text: `API Status Update`
              },
              {
                type: 'TextBlock',
                size: "Small",
                width: "auto",
                weight: 'Bold',
                text: `${message}`,
                wrap: "true"
              },
              {
                type: 'TextBlock',
                size: "Small",
                width: "auto",
                weight: 'Bold',
                text: `${message1}`,
                wrap: "true"
              },
              {
                type: 'TextBlock',
                size: "Small",
                width: "auto",
                weight: 'Light',
                text: `${mentionedUsers.map(user => `<at>${user.name}</at>`).join(' ')}`,
                wrap: "true"
              }
            ],
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.0',
            msteams: {
              width: "Full",
              entities: mentionedUsers.map(user => {
                return {
                  type: 'mention',
                  text: `<at>${user.name}</at>`,
                  mentioned: {
                    id: user.email,
                    name: user.name
                  }
                };
              })
            }
          }
        }
      ]
    };
    await axios.post(teamsWebhookURL, payload);

    console.log('Message sent successfully to Teams.');
  } catch (error) {
    console.error('Error sending message to Teams:', error.message);
  }
};

module.exports = sendMessage;
