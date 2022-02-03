const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config();

const commands = [new SlashCommandBuilder().setName('compile').setDescription('Compiles list with YouTube links in channel')].map(
  (command) => command.toJSON()
);

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
