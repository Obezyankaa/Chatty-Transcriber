const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const dotenvExpand = require("dotenv-expand");

const apiKey = process.env.API_KEY_TELEGRAM;
const apiKeyYandex = process.env.API_KEY_YANDEX;

const token = `${apiKey}`;

const bot = new TelegramBot(token, { polling: true });

// эта команда, работает в случае, если наш бот попадает в группу или канал
// bot.onText(/\/stop/, (msg) => {
//   if (bot.isPolling()) {
//     bot.sendMessage(msg.chat.id, "Пока бро, бот остановлен!");
//     bot.sendMessage(msg.chat.id, "👋🏼");
//     // bot.clearCommands();
//     bot.removeAllCommands();
//     bot.stopPolling();
//   }
// });

bot.onText(/\/stop/, (msg) => {
  bot.sendMessage(msg.chat.id, "Пока бро, бот остановлен!");
  bot.sendMessage(msg.chat.id, "👋🏼");
  bot.stopPolling();
});


// стартовая команда для бота
bot.onText(/\/start/, (msg) => {
  if (!bot.isPolling()) {
    bot.sendMessage(
      msg.chat.id,
      "Привет! Меня зовут Аркадий, я многофункциональный бот, погнали покажу чё могу 🏃💨"
    );
    bot.startPolling();
  }
  console.log("start");
});

bot.onText(/\/conversion/, (msg) => {
  // это действие переводит все голосовые сообщения в текст!
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
          bot.sendMessage(msg.chat.id, "Cекундочку, я почти перевел . . .");
          setTimeout(() => {
            bot.sendMessage(msg.chat.id, command);
          }, 4000);
        });
        setTimeout(() => {
          const arr = [
            "🔥",
            "🤟",
            "💥",
            "💫",
            "😎",
            "🚀",
            "🎯",
            "💪",
            "🫶",
            "👏",
            "🤩",
            "🥳",
            "🤓",
            "👽",
            "👾",
            "👍",
            "✨",
            "🌝",
          ];

          function getRandomValueFromArray(arr) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
          }

          const randomValue = getRandomValueFromArray(arr);
          bot.sendMessage(msg.chat.id, "ваше голосовое сообщение 👆");
          bot.sendMessage(msg.chat.id, randomValue);
        }, 7000);
      } catch (error) {
        bot.sendMessage(
          msg.chat.id,
          "Я вас не понимаю, повторите внятно всой текст!"
        );
      }
    });
  });
  console.log("converter");
});

// эта команда срабатывает в случае если мы просто что-то ввели в бота
bot.on("message", (msg) => {
  if (msg.text && !msg.entities && !msg.reply_to_message) {
    bot.sendMessage(
      msg.chat.id,
      "Смотри, если ты просто будешь мне писать, я буду присылать тебе это сообщение каждый раз, так что если хочешь воспользоваться мной ( тут бы зашла шутка про бывшего 😅) короче используй команды, во вкладке меню"
    );
  }
});
