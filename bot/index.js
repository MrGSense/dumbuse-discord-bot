const { Client, Intents, Interaction, Collection } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'compile') {
    const { channelId } = interaction;

    // Get channel command was used in
    const channel = client.channels.cache.get(channelId);

    const compiledMessages = [];

    // Fetch all messages in channel (May have limit that will need to be worked around 100?)
    // TODO
    // Figure out message limit and how to get around it (Looking for message/messages that come before last message? (https://discord.js.org/#/docs/main/stable/typedef/ChannelLogsQueryOptions)
    await channel.messages
      .fetch()
      .then((messages) => {
        // Filter messages that have embeds and those embeds are from YouTube links (https://discord.js.org/#/docs/main/stable/class/MessageEmbed)
        const filtMessages = messages.filter((message) => message.embeds[0] && message.embeds[0].provider.name === 'YouTube');

        filtMessages.forEach((message) => {
          const embed = message.embeds[0];
          // TODO
          // Do something with message embeded data (embed.title and embed.url)
          if (embed.title && embed.url) {
            const compMes = {
              title: embed.title,
              url: embed.url
            }

            compiledMessages.push(compMes)
          }
          // Simple REST API w/ MongoDB just POST/GET? Create Embeded Message component every compile?
        });
      })
      .catch(console.error());

    // Message sent back from bot
    await interaction.reply(compiledMessages[0] ? `Title: ${compiledMessages[0].title}\nUrl: ${compiledMessages[0].url}`: 'You have no YouTube links in this chat bitch boy');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
