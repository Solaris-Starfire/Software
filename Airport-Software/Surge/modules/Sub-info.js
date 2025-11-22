/*
 * 由 @mieqq 编写，原脚本修改
 * 支持 SF Symbol 或 网络图片 URL
 * 更新日期：2025.11.22
 * 版本：1.7
 */

let args = getArgs();

(async () => {
  let info = await getDataInfo(args.url);
  if (!info) $done();

  let resetDayLeft = getRemainingDays(parseInt(args["reset_day"]));
  let used = info.download + info.upload;
  let total = info.total;
  let expire = args.expire || info.expire;

  let content = [`用量：${bytesToSize(used)} | ${bytesToSize(total)}`];
  if (resetDayLeft) content.push(`重置：剩余${resetDayLeft}天`);
  if (expire && expire !== "false") {
    if (/^[\d.]+$/.test(expire)) expire *= 1000;
    content.push(`到期：${formatTime(expire)}`);
  }

  let now = new Date();
  let hour = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");

  // 判断 icon 类型：URL 或 SF Symbol
  const iconObj =
    args.icon && /^https?:\/\//.test(args.icon)
      ? { "icon-url": args.icon } // 网络图片
      : { icon: args.icon || "airplane.circle", "icon-color": args.color || "#007aff" }; // SF Symbol

  $done({
    title: `${args.title || "节点"} | ${hour}:${minutes}`,
    content: content.join("\n"),
    ...iconObj,
  });
})();

// 解析 argument
function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

// 获取节点流量信息
function getUserInfo(url) {
  let method = args.method || "head";
  let request = { headers: { "User-Agent": "Quantumult%20X" }, url };
  return new Promise((resolve, reject) =>
    $httpClient[method](request, (err, resp) => {
      if (err) reject(err);
      else if (resp.status !== 200) reject(resp.status);
      else {
        let header = Object.keys(resp.headers).find(
          (key) => key.toLowerCase() === "subscription-userinfo"
        );
        if (header) resolve(resp.headers[header]);
        else reject("链接响应头不带有流量信息");
      }
    })
  );
}

async function getDataInfo(url) {
  const [err, data] = await getUserInfo(url)
    .then((data) => [null, data])
    .catch((err) => [err, null]);
  if (err) {
    console.log(err);
    return;
  }
  return Object.fromEntries(
    data
      .match(/\w+=[\d.eE+-]+/g)
      .map((item) => item.split("="))
      .map(([k, v]) => [k, Number(v)])
  );
}

// 剩余重置天数
function getRemainingDays(resetDay) {
  if (!resetDay) return;
  let now = new Date();
  let today = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();
  let daysInMonth = today < resetDay ? 0 : new Date(year, month + 1, 0).getDate();
  return daysInMonth - today + resetDay;
}

// 流量单位转换
function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

// 格式化时间
function formatTime(time) {
  let dateObj = new Date(time);
  return `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
}