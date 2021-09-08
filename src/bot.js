require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));

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
  let nama = split[1];
  let nip = split[2];
  let fakultas = split[3];

  const payload = {
    nama: nama,
    nip: nip,
    fakultas: fakultas,
  };

  const datas = `
  Berhasil submit data :
  Nama     : ${payload.nama}
  Nip      : ${payload.nip}
  Fakultas : ${payload.fakultas}
  `;

  if (payload.nama || payload.nip || payload.fakultas === undefined) {
    bot.telegram.sendMessage(context.chat.id, "Format salah");
  } else {
    // do something
    bot.telegram.sendMessage(context.chat.id, datas);
  }
  console.log(payload);
});

bot.action("lapor", async (ctx) => {
  try {
    const message = `lapor menggunakan command /lapor #NAMA #NIP #FAKULTAS`;
    bot.telegram.sendMessage(ctx.chat.id, message);
  } catch (error) {
    console.log(error);
  }
});

bot.launch();
