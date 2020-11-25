/*
Quick Summary:
Slackbot handler and event response
Deployed to AWS Lambda
*/

import { App } from "@slack/bolt";
import { getFirstPost } from "./scraper";

const success_response = {
  statusCode: 200,
  body: null,
};

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const messageResponse = async (slackEvent, callback) => {
  // callback sending Slack a 200 response
  callback(null, success_response);
  const { bot_id, channel_type, text, type } = slackEvent;

  // determining type of request from slack
  if (bot_id == "B01E5B1LCMQ") {
    console.log("I know I am a bot, return this");
    return;
  } else if (text == "News" && channel_type == "im" && type == "message") {
    const article = await getFirstPost();
    await publishMessage(slackEvent.channel, article);
    return;
  } else {
    console.log("Nothing to report");
    return;
  }
};

const publishMessage = async (id, text) => {
  try {
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
    });
  } catch (error) {
    console.error(error);
  }
};

//the handler receiving the response
export const slackBot = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const slackEvent = body.event;
  messageResponse(slackEvent, callback);
};
