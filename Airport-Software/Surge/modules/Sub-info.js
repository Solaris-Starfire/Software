/*
 * 多机场订阅流量信息 — Surge 面板 (Rabbit-Spec 多机场版)
 * 支持：无限机场 URL
 * 参数：nameX/urlX/reset_dayX
 */

let args = getArgs();

(async () => {
  let panels = [];

  // 遍历所有 urlN 参数
  let n = 1;
  while (args[`url${n}`]) {
    let url = args[`url${n}`];
    let title = args[`name${n}`] || `机场${n}`;
    let resetDay = args[`reset_day${n}`];
    let expireArg = args[`expire${n}`];

    let info = await getDataInfo(url);

    if (info) {
      let used = info.download + info.upload;
      let total = info.total;
      let expire = expireArg || info.expire;
      let resetDayLeft = getRmainingDays(parseInt(resetDay));

      let content = [`用量：${bytesToSize(used)} | ${bytesToSize(total)}`];

      if (resetDayLeft) content.push(`重置：剩余 ${resetDayLeft} 天`);
      if (expire && expire !== "false") {
        if (/^[\d.]+$/.test(expire)) expire *= 1000;
        content.push(`到期：${formatTime(expire)}`);
      }

      panels.push(`【${title}】\n${content.join("\n")}`);
    }

    n++;
  }

  let now = new Date();
  let time = now.toTimeString().slice(0, 5);

  $done({
    title: `多机场流量 | ${time}`,
    content: panels.join("\n\n——————————————\n\n"),
    icon: args.icon || "externaldrive.fill.badge.icloud",
    "icon-color": args.color || "#FFB6C1",
  });
})();

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map(it => it.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function getUserInfo(url) {
  return new Promise((resolve, reject) => {
    $httpClient.head(
      {
        url,
        headers: { "User-Agent": "Quantumult%20X" }
      },
      (err, resp) => {
        if (err) return reject(err);
        if (resp.status !== 200) return reject(resp.status);

        let header = Object.keys(resp.headers).find(k =>
          k.toLowerCase() === "subscription-userinfo"
        );

        if (header) resolve(resp.headers[header]);
        else reject("响应头不含流量信息");
      }
    );
  });
}

async function getDataInfo(url) {
  const [err, data] = await getUserInfo(url)
    .then(data => [null, data])
    .catch(err => [err, null]);

  if (err) {
    console.log(err);
    return;
  }

  return Object.fromEntries(
    data.match(/\w+=[\d.eE+-]+/g)
      .map(it => it.split("="))
      .map(([k, v]) => [k, Number(v)])
  );
}

function getRmainingDays(day) {
  if (!day) return;

  let now = new Date();
  let today = now.getDate();
  let daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return day > today ? day - today : daysInMonth - today + day;
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatTime(time) {
  let d = new Date(time);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}