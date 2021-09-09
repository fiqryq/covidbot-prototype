require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const url = process.env.DEV_URL;

// on start bot
bot.start((ctx) =>
  ctx.reply(
    "Selamat datang di bot tel-u siaga covid 19 gunakan perintah /menu untuk memilih menu"
  )
);

// menu with inline menu
bot.command("menu", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "------------------MENU------------------",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Laporan Mandiri", callback_data: "laporan_mandiri" }],
          [
            { text: "Vaksin", callback_data: "vaksin" },
            { text: "Info", callback_data: "menu_info" },
            { text: "Kasus", callback_data: "kasus" },
          ],
          [{ text: "Kontak", callback_data: "kontak" }],
        ],
      },
    }
  );
});

bot.action("menu_info", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "------------------INFO------------------",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Info Rumah Sakit", callback_data: "rs" }]],
      },
    }
  );
});

bot.action("rs", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "INI MENU INFO RS");
});

bot.command("lapor", (context) => {
  // get msg data
  let msg = context.message.text;
  let split = msg.split("#");

  // split array msg
  let email = split[1];
  let nama = split[2];
  let nip = split[3];
  let fakultas = split[4];

  const payload = {
    email: email,
    name: nama,
    nip: nip,
    faculty: fakultas,
  };

  const datas = `Laporan telah berhasil di submit.`;
  postDataLaporan(context, payload, datas);
});

async function postDataLaporan(context, payload, datas) {
  try {
    await axios
      .post(`${url}/pegawai`, payload)
      .then(function (response) {
        console.log(response);
        bot.telegram.sendMessage(context.chat.id, datas);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

bot.action("laporan_mandiri", async (ctx) => {
  try {
    const message = `
    Lapor menggunakan perintah :
    /lapor  #EMAIL #NAMA #NIP #FAKULTAS`;
    bot.telegram.sendMessage(ctx.chat.id, message);
  } catch (error) {
    console.log(error);
  }
});

bot.action("kasus", async (ctx) => {
  try {
    const response = await axios.get(`${url}/pegawai`);
    const data = response.data.data;
    let messages = "";
    data.forEach((e, i) => {
      messages = `${i}. ${e.name}`;
    });
    let str1 = `Data covid : `;
    let str2 = str1.concat(messages);
    bot.telegram.sendMessage(ctx.chat.id, str2);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

bot.launch();
