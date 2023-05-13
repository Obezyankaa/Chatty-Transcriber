const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const dotenvExpand = require("dotenv-expand");

const apiKey = process.env.API_KEY_TELEGRAM;
const apiKeyYandex = process.env.API_KEY_YANDEX;

const token = `${apiKey}`;

const bot = new TelegramBot(token, { polling: true });

bot.on("voice", (msg) => {
  const stream = bot.getFileStream(msg.voice.file_id);

  let chunks = [];
  stream.on("data", (chunk) => chunks.push(chunk));
  stream.on("end", () => {
    const axiosConfig = {
      method: "POST",
      url: "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize",
      headers: {
        Authorization: "Api-Key " + apiKeyYandex,
      },
      data: Buffer.concat(chunks),
    };
    try {
      axios(axiosConfig).then((response) => {
        const command = response.data.result;
        bot.sendMessage(msg.chat.id, "💬");
        setTimeout(() => {
          bot.sendMessage(msg.chat.id, command);
        },4000)
      });
        setTimeout(() => {
          bot.sendMessage(msg.chat.id, "🔥");
        },7000)
    } catch (error) {
      console.log("ошибка распознования речи", error);
    }
  });
});
