const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();
const prefix = "$";
const args = [];

// TODO: Add live notifications when streamer goes live

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Hello message when bot is added to server
client.on("guildCreate", (guild) => {
  guild.systemChannel.send(
    `Hello, I'm Twitchy! You can use me to get current info on your favourite Twitch streamers, like whether they're live and what they are playing. Enter $help to get a list of my commands!`
  );
});

client.on("message", (msg) => {
  // split message into array of words and select streamer
  args = msg.content.split(" ");
  // ["$live", "loltyler1"]
  const streamer = args[1];
  // If bot sends message end functions
  if (msg.author.bot) return;

  // Get info
  if (msg.content.startsWith(`${prefix}live`)) {
    if (args.length === 1) {
      msg.reply("Please enter a streamer name");
      return;
    }

    // Make get request to Twitch API with streamer name
    axios
      .get(`https://api.twitch.tv/helix/search/channels?query=${streamer}`, {
        headers: {
          "client-id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
      })
      .then((res) => {
        // Set data equal to response and filter through data for streamer with correct name
        let response = res.data.data;
        // Check if there was data in response
        if (response.length === 0) {
          msg.reply("Streamer not found.");
          return;
        } else {
          const broadcaster = response.filter(
            (filter) => filter.display_name.toLowerCase() === streamer
          )[0];
          // Check if broadcaster exists in response
          if (broadcaster) {
            // Make api call if broadcaster is live and send msg to user
            broadcaster.is_live
              ? msg.reply(
                  `${broadcaster.broadcaster_login} is live playing ${broadcaster.game_name}. Watch here: https://twitch.tv/${broadcaster.broadcaster_login}`
                )
              : msg.reply(`${broadcaster.broadcaster_login} is not live`);
          } else {
            msg.reply("Streamer not found.");
          }
        }
      })
      .catch((err) => console.log(err));
  }

  // Return current game being played
  if (msg.content.startsWith(`${prefix}game`)) {
    if (args.length === 1) {
      msg.reply("Please enter a streamer name");
    }

    // Make get request to Twitch API with streamer name
    axios
      .get(`https://api.twitch.tv/helix/search/channels?query=${args[1]}`, {
        headers: {
          "client-id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
      })
      // get response and reply with data from api
      .then((res) => {
        if (!res.data) msg.reply("That streamer was not found.");
        // Set data equal to response and filter through data for streamer with correct name
        let response = res.data.data;
        const broadcaster = response.filter(
          (filter) => filter.display_name.toLowerCase() === streamer
        )[0];
        if (broadcaster) {
          broadcaster.is_live
            ? msg.reply(
                `${broadcaster.broadcaster_login} is playing ${broadcaster.game_name}`
              )
            : msg.reply(
                `${broadcaster.broadcaster_login} is not live and is not playing anything.`
              );
        } else {
          msg.reply("Streamer not found.");
        }
      })
      .catch((err) => console.log(err));
  }

  // Help Message
  if (msg.content.startsWith(`${prefix}help`)) {
    msg.channel.send(
      ` > **List of commands:** \n\n\`$live [streamer name]\` - Checks if a streamer is live or not and what they're playing. 
      \n\`$game [streamer name]\` - Checks to see what game a streamer is playing.
      \n\`$help\` - Displays list of commands.

      `
    );
  }
});

client.login(process.env.BOT_TOKEN);

module.exports = { args, client, axios, Discord };
