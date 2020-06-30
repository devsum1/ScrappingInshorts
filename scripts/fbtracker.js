const cheerio = require("cheerio");
const axios = require("axios");
const gTTs = require("gtts");
const qs = require("qs");
const readline = require("readline");
const { start } = require("repl");
const { cssNumber } = require("jquery");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//"/en/ajax/more_news",{'category':'','news_offset':min_news_id}

let min_news_id = "";
let userName = "";
let greeting;
let limit;
let selected_category;
let news_headlines = [];
let categories = [
  "All News",
  "National",
  "Business",
  "Sports",
  "World",
  "Politics",
  "Technology",
  "Startup",
  "Entertainment",
  "Miscellaneous",
  "Hatke",
  "Science",
  "Automobile",
];

const extractNews = async () => {
  console.log(`${news_headlines.length} news fetched`);

  if (news_headlines.length >= limit) return;

  let url = `https://inshorts.com/en/ajax/more_news`;

  //Sending Form_URL_ENCODED data
  await axios
    .post(
      url,
      qs.stringify({
        category: selected_category,
        news_offset: min_news_id,
      })
    )
    .then(async (res) => {
      min_news_id = res.data.min_news_id;

      const $ = cheerio.load(res.data.html);
      const news = $(".news-card.z-depth-1 .news-card-title.news-right-box");

      news.each((i, elem) => {
        if (news_headlines.length >= limit) return;

        const headLines = $(elem).find("a.clickable span");
        news_headlines.push(headLines.text());
      });
      await extractNews();
    })
    .catch((err) => convertToMp3(news_headlines));
};

const convertToMp3 = (speech) => {
  console.log("Wait! Converting in progres...");
  const gtts = new gTTs(speech, "en");
  gtts.save(`news.mp3`, function (err, result) {
    if (err) {
      throw new Error(err);
    }
    console.log(
      `Success! Open file news.mp3 to hear result in path ${__dirname}`
    );
    rl.close();
  });
};

const initialise = async (url) => {
  await axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const s = $("script").last().html();
      //Extracting min_news_id from script
      min_news_id = s.replace(/\s\s+/g, "").split('"')[1];
    })
    .catch((err) => err);
};

const ask = (questionText) => {
  return new Promise((resolve, reject) => {
    rl.question(questionText, (input) => resolve(input));
  });
};

const input = async () => {
  userName = await ask("Enter Your Name \n");
  limit = await ask("How many news do you want? \n");
  categories.map((elem, i) => console.log(`${i + 1}. ${elem}`));
  let choice = await ask("Choose your interest\n");
  selected_category = choice == 1 ? "" : categories[choice - 1].toLowerCase();
};

//Initialiser
(async () => {
  await input();
  let url = `https://inshorts.com/en/read/${selected_category}`;
  await initialise(url);
  await extractNews();

  let content = `Hey ${userName},Here are some of the news you are missing in category ${selected_category}!I hope you like it\n`;
  news_headlines.map((elem, i) => {
    content += `${i + 1} \n ${elem} \n`;
  });

  //News title
  console.log(news_headlines);
  convertToMp3(content);
})();
