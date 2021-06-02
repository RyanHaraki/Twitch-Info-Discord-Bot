const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();
const prefix = "$";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  // split message into array of words and select streamer
  const args = msg.content.split(" ");
  const streamer = args[1];
  // If bot sends message end functions
  if (msg.author.bot) return;

  // Get info
  if (msg.content.startsWith(`${prefix}live`)) {
    // Make get request to Twitch API with streamer name
    axios
      .get(`https://api.twitch.tv/helix/search/channels?query=${streamer}`, {
        headers: {
          "client-id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
      })
      .then((res) => {
        // Check to see if any streamers were returned
        if (!res.data) msg.reply("Streamer not found.");
        // Set data equal to response and filter through data for streamer with correct name
        let response = res.data.data;
        const broadcaster = response.filter(
          (filter) => filter.display_name.toLowerCase() === streamer
        )[0];

        broadcaster.is_live
          ? msg.reply(
              `${broadcaster.broadcaster_login} is live playing ${broadcaster.game_name}. Watch here: https://twitch.tv/${broadcaster.broadcaster_login}`
            )
          : msg.reply(`${broadcaster.broadcaster_login} is not live`);
      })
      .catch((err) => console.log(err));
  }

  // Return current game being played
  if (msg.content.startsWith(`${prefix}game`)) {
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
        if (!res.data) msg.reply("Streamer not found.");
        // Set data equal to response and filter through data for streamer with correct name
        let response = res.data.data;
        const broadcaster = response.filter(
          (filter) => filter.display_name.toLowerCase() === streamer
        )[0];
        broadcaster.is_live
          ? msg.reply(
              `${broadcaster.broadcaster_login} is playing ${broadcaster.game_name}`
            )
          : msg.reply(
              `${broadcaster.broadcaster_login} is not live, hence is not playing anything`
            );
      })
      .catch((err) => console.log(err));
  }

  // Gleb Message
  if (msg.content.startsWith(`${prefix}gleb`)) {
    msg.channel.send(
      `GLEB LIKES GAY PORN GLEB LIKES GAY PORN GLEB LIKES GAY PORN GLEB LIKES GAY PORN`
    );
  }

  // Help Message
  if (msg.content.startsWith(`${prefix}help`)) {
    msg.channel.send(
      ` > **List of commands:** \n\n\`$live [name]\` - Checks if a streamer is live or not and what they're playing. 
      \n\`$game [name]\` - Checks to see what game a streamer is playing.
      \n\`$help\` - Displays list of commands.

      `
    );
  }
});

client.login(process.env.BOT_TOKEN);
