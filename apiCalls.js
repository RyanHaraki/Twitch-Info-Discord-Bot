import { args, client, axios, Discord } from "./index";

// UNDER WORK

function makeApiCall(prefix, args) {
  if (args)
    axios
      .get(`https://api.twitch.tv/helix/search/channels?query=${args[1]}`, {
        headers: {
          "client-id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
      })
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
              `${broadcaster.broadcaster_login} is not live and is not playing anything.`
            );
      })
      .catch((err) => console.log(err));
}

export default makeApiCall;
