require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const url = process.env.DEV_URL;

// on start bot
bot.start((ctx) => ctx.reply("Welcome"));

// menu with inline menu
bot.command("menu", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Pilih menu ", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Laporan Mandiri", callback_data: "lapor" }],
        [
          { text: "Status Vaksin", callback_data: "status_vaksin" },
          { text: "Info Vaksin", callback_data: "vaksin" },
        ],
        [
          { text: "Info Rumah Sakit", callback_data: "rs" },
          { text: "Kasus Harian", callback_data: "kasus" },
        ],
        [
          { text: "Kontak", callback_data: "kontak" },
          { text: "Info Bot", callback_data: "info" },
        ],
      ],
    },
  });
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

  const datas = `
  Berhasil submit data :
  Email     : ${payload.email}
  Nama     : ${payload.name}
  Nip      : ${payload.nip}
  Fakultas : ${payload.faculty}
  `;
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

bot.action("lapor", async (ctx) => {
  try {
    const message = `lapor menggunakan command /lapor #NAMA #NIP #FAKULTAS`;
    bot.telegram.sendMessage(ctx.chat.id, message);
  } catch (error) {
    console.log(error);
  }
});

bot.launch();
