import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();



const token = process.env.BOT_TOKEN;

const bot = new Bot(String(token));

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.on("message", async (ctx) => {
    ctx.reply("Bot can't answer. You need use commands or Telegram mini app!")
});

bot.on("edited_message", async (ctx) => {
  // Получите новый, отредактированный текст сообщения.
    const editedText = ctx.editedMessage.text;
    console.log(editedText, '👈👈 editedText');
    ctx.reply("sms refactoring")
});


bot.start();
