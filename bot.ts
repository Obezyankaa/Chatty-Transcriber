import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN_TELEGRAM;

const bot = new Bot(String(token));

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
