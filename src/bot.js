require("dotenv").config();
const { Telegraf } = require("telegraf");
const moment = require("moment");
const axios = require("axios");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const url = process.env.DEV_URL;
const national_vaccine = process.env.URL_VAKSIN_NASIONAL;

const { numberFormat } = require("../utils/helper");

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
          [
            { text: "Kontak", callback_data: "kontak" },
            { text: "Tentang bot", callback_data: "about" },
          ],
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
        inline_keyboard: [
          [
            { text: "Info Rumah Sakit", callback_data: "rs" },
            {
              text: "Status Vaksin Nasional",
              callback_data: "vaksin_nasional",
            },
          ],
        ],
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

bot.action("about", (ctx) => {
  const data = [
    {
      id: 1,
      name: "Cekdiri.id",
    },
    {
      id: 2,
      name: "SIRANAP V 3.0",
    },
  ];
  const body = data.map((e, i) => `${i + 1}. ${e.name}`);
  const payload = body.join(`\n\r`);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `bot dikembangkan oleh : xxxx\n\rsumber data :\n${payload}`
  );
});

bot.action("kontak", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "INFO : 08122XXXXX");
});

bot.action("vaksin_nasional", async (ctx) => {
  try {
    const response = await axios.get(`${national_vaccine}`);
    const data = response.data.monitoring[0];
    const {
      date,
      total_sasaran_vaksinasi,
      sasaran_vaksinasi_sdmk,
      sasaran_vaksinasi_petugas_publik,
      sasaran_vaksinasi_lansia,
      sasaran_vaksinasi_masyarakat_umum,
      sasaran_vaksinasi_kelompok_1217,
      vaksinasi1,
      vaksinasi2,
    } = data;
    const today = moment(date).format("LL");
    const cakupan = data.cakupan;
    console.log(cakupan);

    const message = `Data status vaksinasi nasional ${today}\n\r\n\Sasaran vaksinasi :\n\rTotal : ${numberFormat(
      total_sasaran_vaksinasi
    )}\n\rSDMK : ${numberFormat(
      sasaran_vaksinasi_sdmk
    )}\n\rPetugas Publik : ${numberFormat(
      sasaran_vaksinasi_petugas_publik
    )}\n\rLansia : ${numberFormat(
      sasaran_vaksinasi_lansia
    )}\n\rUmum : ${numberFormat(
      sasaran_vaksinasi_masyarakat_umum
    )}\n\rKelompok usia 12_17 : ${numberFormat(
      sasaran_vaksinasi_kelompok_1217
    )}\n\rDosis 1 : ${numberFormat(vaksinasi1)}\n\rDosis 2 : ${numberFormat(
      vaksinasi2
    )}\n\r\n\rPersentase : \n\r\n\rVaksinasi dosis 1 : ${numberFormat(
      cakupan.vaksinasi1
    )} \n\r-sdm kesehatan : ${numberFormat(
      cakupan.sdm_kesehatan_vaksinasi1
    )}\n\r-petugas publik : ${numberFormat(
      cakupan.petugas_publik_vaksinasi1
    )}\n\r-lansia : ${numberFormat(
      cakupan.lansia_vaksinasi1
    )}\n\r-umum : ${numberFormat(
      cakupan.masyarakat_umum_vaksinasi1
    )}\n\r-usia 12_17 : ${numberFormat(
      cakupan.kelompok_usia_12_17_vaksinasi1
    )}\n\r\n\rVaksinasi dosis 2 : ${numberFormat(
      cakupan.vaksinasi2
    )} \n\r-sdm kesehatan : ${numberFormat(
      cakupan.sdm_kesehatan_vaksinasi2
    )}\n\r-petugas publik : ${numberFormat(
      cakupan.petugas_publik_vaksinasi2
    )}\n\r-lansia : ${numberFormat(
      cakupan.lansia_vaksinasi2
    )}\n\r-umum : ${numberFormat(
      cakupan.masyarakat_umum_vaksinasi2
    )}\n\r-usia 12_17 : ${numberFormat(
      cakupan.kelompok_usia_12_17_vaksinasi2
    )}`;

    bot.telegram.sendMessage(ctx.chat.id, message);
  } catch (error) {
    console.log(error);
  }
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
    if (data.length > 0) {
      bot.telegram.sendMessage(ctx.chat.id, body);
    } else {
      bot.telegram.sendMessage(ctx.chat.id, "Tidak ada laporan kasus hari ini");
    }
  } catch (error) {
    console.log(error);
  }
});

// bot.action("total_case", async (ctx) => {
//   try {
//     const response = await axios.get(`${url}/totalcase`);
//     const data = response.data.data;
//     const names = data.map((e, i) => `${i + 1}. ${e.name} #${e.faculty}`);
//     const datanames = names.join("\r\n");
//     const body = `Data covid ${today} : \n${datanames}`;
//     bot.telegram.sendMessage(ctx.chat.id, body);
//   } catch (error) {
//     console.log(error);
//   }
// });

bot.launch();
