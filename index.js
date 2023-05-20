const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const dotenvExpand = require("dotenv-expand");

const apiKey = process.env.API_KEY_TELEGRAM;
const apiKeyYandex = process.env.API_KEY_YANDEX;

const token = `${apiKey}`;

const bot = new TelegramBot(token, { polling: true });


// bot.onText(/\/stop/, (msg) => {
//   bot.sendMessage(msg.chat.id, "Пока бро, бот остановлен!");
//   bot.sendMessage(msg.chat.id, "👋🏼");
//   bot.stopPolling();
// });


// стартовая команда для бота
bot.onText(/\/start/, (msg) => {
  console.log(msg);
  if (!bot.isPolling()) {
    bot.sendMessage(
      msg.chat.id,
      `Привет, ${firstName} Меня зовут Аркадий, я многофункциональный бот, погнали покажу чё могу. 👉 нажмите на /info 👈`
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

bot.onText(/\/info/, (msg) => {
  const text = [
    "Небольшой рассказ о том, что умеет данный бот!",
    "1. Получайте дозу юмора с помощью бота, который может выбрать для вас случайную шутку Чака Норриса - героя многих мемов и легендарных фильмов!",
    "2. Получайте заряд позитива и улыбок с помощью бота, который может прислать вам рандомный мем с котиками - одним из самых популярных и любимых животных в интернете!",
    "3. Проверьте свою удачу и соревнуйтесь с ботом в игре, где он загадывает число от 1 до 100, а вы пытаетесь его угадать. Бот не обманет и определит победителя, сравнивая ваши числа!",
    "4. Будьте в курсе погоды в вашем городе с помощью бота, который может прислать вам актуальную информацию о погоде - от температуры до прогноза на ближайшие дни!",
    "5. Не знаете, какой фильм посмотреть на вечер? Бот поможет вам выбрать случайный фильм - от классики до новинок, чтобы вы могли насладиться просмотром в уютной обстановке!",
    "6. Записывайте голосовые сообщения для бота, и он преобразует их в текстовый формат, чтобы вы могли легко и быстро прочитать их содержание. Это удобно и позволяет сохранить важную информацию!",
  ];
  bot.sendMessage(msg.chat.id, text.join("\n"));
});

// Функция для запуска игры

function startGame(chatId) {
  const number = Math.floor(Math.random() * 100) + 1; // Загадываем число от 1 до 100
  let attempts = 0; // Количество попыток
  // Обработчик сообщений от пользователя
  bot.on(/\/games/, (msg) => {
    const chatId = msg.chat.id;
    const guess = parseInt(msg.text); // Преобразуем ответ пользователя в число

    if (guess === number) {
      attempts++; // Увеличиваем количество попыток
      bot.sendMessage(
        chatId,
        `Поздравляю, вы угадали число ${number} за ${attempts} попыток!`
      );
      // Останавливаем обработку сообщений от пользователя
      bot.removeAllListeners("message");
    } else if (guess > number) {
      attempts++; // Увеличиваем количество попыток
      bot.sendMessage(
        chatId,
        `Мое число меньше, чем ${guess}. Попробуйте еще раз.`
      );
    } else if (guess < number) {
      attempts++; // Увеличиваем количество попыток
      bot.sendMessage(
        chatId,
        `Мое число больше, чем ${guess}. Попробуйте еще раз.`
      );
    }
  });
}
startGame()



// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const firstName = msg.from.first_name;
//   const username = msg.from.username;

//   // отправляем сообщение пользователю, который нажал /start
//   bot.sendMessage(
//     chatId,
//     `Привет, ${firstName} (${username})! Ты успешно запустил бот.`
//   );

//   // отправляем сообщение другому пользователю
//   const otherChatId = 442233045; // здесь нужно указать ID чата другого пользователя
//   bot.sendMessage(
//     otherChatId,
//     `${firstName} (${username}) только что запустил бот.`
//   );
// });