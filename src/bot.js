require("dotenv").config();
const { Telegraf } = require("telegraf");
const moment = require("moment");
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
            { text: "Vaksin", callback_data: "menu_vaksin" },
            { text: "Info", callback_data: "menu_info" },
            { text: "Kasus", callback_data: "menu_kasus" },
          ],
          [{ text: "Kontak", callback_data: "kontak" }],
        ],
      },
    }
  );
});

bot.action("menu_vaksin", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "------------------VAKSIN------------------",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Lapor Vaksin", callback_data: "rs" },
            { text: "Status Vaksin", callback_data: "rs" },
          ],
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

bot.action("menu_kasus", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "------------------KASUS------------------",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Total Kasus", callback_data: "total_case" },
            { text: "Kasus Hari Ini", callback_data: "today_case" },
          ],
        ],
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
  let date = moment().format();

  const payload = {
    email: email,
    name: nama,
    nip: nip,
    faculty: fakultas,
    created_date: date,
  };

  if (split.length != 5) {
    console.log(payload);
    bot.telegram.sendMessage(context.chat.id, "Format salah");
  } else {
    console.log(payload);
    const message = `Laporan telah berhasil di submit.`;
    postDataLaporan(context, payload, message);
  }
});

async function postDataLaporan(context, payload, message) {
  try {
    await axios
      .post(`${url}/pegawai`, payload)
      .then(function (response) {
        console.log(response);
        bot.telegram.sendMessage(context.chat.id, message);
      })
      .catch(function (error) {
        bot.telegram.sendMessage(context.chat.id, "gagal submit data");
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

bot.action("laporan_mandiri", async (ctx) => {
  try {
    const message = `
    Lapor menggunakan perintah : \n\r/lapor  #EMAIL #NAMA #NIP #FAKULTAS \n\r\n\r Contoh :\n\r#fiqry@gmail.com #Fiqry ch #1999276 #FIT`;
    bot.telegram.sendMessage(ctx.chat.id, message);
  } catch (error) {
    console.log(error);
  }
});

bot.action("today_case", async (ctx) => {
  try {
    const today = moment().format("LL");
    const response = await axios.get(`${url}/casetoday`);
    const data = response.data.data;
    const names = data.map((e, i) => `${i + 1}. ${e.name} #${e.faculty}`);
    const datanames = names.join("\r\n");
    const body = `Data covid ${today} : \n${datanames}`;
    bot.telegram.sendMessage(ctx.chat.id, body);
  } catch (error) {
    console.log(error);
  }
});

bot.action("total_case", async (ctx) => {
  try {
    const response = await axios.get(`${url}/totalcase`);
    const data = response.data.data;
    const names = data.map((e, i) => `${i + 1}. ${e.name} #${e.faculty}`);
    const datanames = names.join("\r\n");
    const body = `Data covid ${today} : \n${datanames}`;
    bot.telegram.sendMessage(ctx.chat.id, body);
  } catch (error) {
    console.log(error);
  }
});

bot.launch();
