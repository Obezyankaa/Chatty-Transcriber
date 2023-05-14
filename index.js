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

// шутка с чаком норисом 
bot.onText(/\/joke/, (msg) => {
  axios
    .get("https://api.chucknorris.io/jokes/random")
    .then((response) => {
      const joke = response.data.value;
      const chatId = msg.chat.id;
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Случайная шутка",
                callback_data: "new_joke",
              },
            ],
          ],
        },
      };
      bot.sendMessage(chatId, joke, options);
    })
    .catch((error) => {
      console.log(error);
    });
});

bot.on("callback_query", (query) => {
  if (query.data === "new_joke") {
    axios
      .get("https://api.chucknorris.io/jokes/random")
      .then((response) => {
        const joke = response.data.value;
        const chatId = query.message.chat.id;
        bot.editMessageText(joke, {
          chat_id: chatId,
          message_id: query.message.message_id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// мемы с котиком 

const arrKey = [
  100, 101, 102, 103, 200, 201, 202, 203, 204, 206, 207, 300, 301, 302, 303,
  304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410,
  411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426,
  429, 431, 444, 450, 451, 497, 498, 499, 500, 501, 502, 503, 504, 506, 507,
  508, 509, 510, 511, 521, 522, 523, 525, 599,
];

bot.onText(/\/cat/, (msg) => {
  const status = arrKey[Math.floor(Math.random() * arrKey.length)];
  const imageUrl = `https://http.cat/${status}`;
  axios
    .get(imageUrl, { responseType: "arraybuffer" })
    .then((response) => {
      const chatId = msg.chat.id;
      bot.sendPhoto(chatId, response.data, { caption: `HTTP ${status}` });
    })
    .catch((error) => {
      console.log(error);
    });
});