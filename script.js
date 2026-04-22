const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlES7OdTACL5qRAJnh-TaverSftasVPstfkHuNPE2SABVfsyENM3kseAzOf1G1jNwy5iFgsgmVkaXP/pub?gid=0&single=true&output=csv";

let data = [];
let lamps = [];
let lampMap = {};

const wall = document.getElementById("wall");

/* 祈福 */
const blessings = [
  "✨ 功德光明迴向一切眾生",
  "🙏 願此光明照破無明",
  "🌟 福慧雙修 吉祥圓滿"
];

function getRandomBlessing() {
  return blessings[Math.floor(Math.random() * blessings.length)];
}

/* 建燈 */
for (let i = 0; i < 400; i++) {
  const div = document.createElement("div");
  div.className = "lamp";
  wall.appendChild(div);
  lamps.push(div);
}

/* 燈號 */
function lampToIndex(code) {
  if (!code) return -1;
  const side = code[0];
  const num = parseInt(code.slice(1));
  if (side === "A") return num - 1;
  if (side === "B") return 200 + (num - 1);
  return -1;
}

/* 模糊 */
function normalize(str) {
  return (str || "").replace(/\s/g, "").toLowerCase();
}

/* 讀資料 */
fetch(SHEET_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(text => {
    data = text.split("\n").map(r => r.split(","));
  });

/* 搜尋 */
document.getElementById("search").addEventListener("input", e => {
  const keywordRaw = e.target.value.trim();
  const keyword = normalize(keywordRaw);

  lamps.forEach(l => l.classList.remove("active"));
  lampMap = {};

  if (!keyword) {
    const card = document.getElementById("card");
    card.classList.add("hidden");
    card.innerHTML = "";
    return;
  }

  const results = data.filter(r => normalize(r[3]).includes(keyword));

  results.forEach(r => {
    const index = lampToIndex(r[1]);
    if (index >= 0) {
      lamps[index].classList.add("active");

      if (!lampMap[index]) lampMap[index] = [];
      lampMap[index].push(r);
    }
  });

  showCards(results);
});

/* 卡片 */
function showCards(rows) {
  const card = document.getElementById("card");

  if (!rows.length) {
    card.innerHTML = "查無資料 🙏";
    card.classList.remove("hidden");
    return;
  }

  card.innerHTML = `
    <div style="margin-bottom:10px;">
      🙏 點燈人：${rows[0][3]}<br>
      🪔 共 ${rows.length} 盞燈
    </div>
  ` + rows.map(r => `
    <div class="card-item">
      🪔 ${r[0]}（被點燈者）<br>
      燈號：${r[1]}<br>
      ${r[2]}
    </div>
  `).join("") + `
    <br>${getRandomBlessing()}
  `;

  card.classList.remove("hidden");
}