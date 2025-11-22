/*
 * 由@mieqq编写
 * 原脚本地址：https://raw.githubusercontent.com/mieqq/mieqq/master/sub_info_panel.js
 * 修改：显示剩余流量
 * 更新日期：2025.11.22
 * 版本：1.6
*/

/*

let args = getArgs();

(async () => {
  let info = await getDataInfo(args.url);
  if (!info) $done();
  let resetDayLeft = getRemainingDays(parseInt(args["reset_day"]));

  let used = info.download + info.upload;
  let total = info.total;
  let remain = total - used;  // 新增剩余流量
  let expire = args.expire || info.expire;

  let content = [
    `用量：${bytesToSize(used)} | ${bytesToSize(total)}`,
    `剩余：${bytesToSize(remain)}`  // 显示剩余流量
  ];

  if (resetDayLeft) {
    content.push(`重置：剩余${resetDayLeft}天`);
  }
  if (expire && expire !== "false") {
    if (/^[\d.]+$/.test(expire)) expire *= 1000;
    content.push(`到期：${formatTime(expire)}`);
  }

  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  hour = hour > 9 ? hour : "0" + hour;
  minutes = minutes > 9 ? minutes : "0" + minutes;

  $done({
    title: `${args.title || "节点"} | ${hour}:${minutes}`,
    content: content.join("\n"),
    icon: args.icon || "airplane.circle",
    "icon-color": args.color || "#007aff",
  });
})();

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function getUserInfo(url) {
  let method = args.method || "head";
  let request = { headers: { "User-Agent": "Quantumult%20X" }, url };
  return new Promise((resolve, reject) =>
    $httpClient[method](request, (err, resp) => {
      if (err != null) {
        reject(err);
        return;
      }
      if (resp.status !== 200) {
        reject(resp.status);
        return;
      }
      let header = Object.keys(resp.headers).find(
        (key) => key.toLowerCase() === "subscription-userinfo"
      );
      if (header) {
        resolve(resp.headers[header]);
        return;
      }
      reject("链接响应头不带有流量信息");
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

function getRemainingDays(resetDay) {
  if (!resetDay) return;

  let now = new Date();
  let today = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();
  let daysInMonth;

  if (resetDay > today) {
    daysInMonth = 0;
  } else {
    daysInMonth = new Date(year, month + 1, 0).getDate();
  }

  return daysInMonth - today + resetDay;
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatTime(time) {
  let dateObj = new Date(time);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  return year + "年" + month + "月" + day + "日";
}

*/


/*
 * 多机场流量显示脚本（动态节点数量，适配 RESET_Dayx 命名）
 * 版本：5.0
 * 更新日期：2025.11.22
 * 参数格式：
 * NAMEx, URLx, RESET_Dayx, EXPIREx, ICONx, COLORx
 * x = 1,2,3,... 动态可扩展
 */

let args = getArgs();

(async () => {
  let nodes = getDynamicNodes(args);
  let results = [];

  for (let node of nodes) {
    let info = await getDataInfo(node.url);
    if (!info) continue;

    let used = info.download + info.upload;
    let total = info.total;
    let remain = total - used;
    let percent = total ? Math.round((remain / total) * 100) : 0;
    let expire = node.expire || info.expire;
    let resetDayLeft = getRemainingDays(parseInt(node.reset));

    let content = [
      `用量：${bytesToSize(used)} | ${bytesToSize(total)}`,
      `剩余：${bytesToSize(remain)}`
    ];
    if (resetDayLeft) content.push(`重置：剩余${resetDayLeft}天`);
    if (expire && expire !== "false") {
      if (/^[\d.]+$/.test(expire)) expire *= 1000;
      content.push(`到期：${formatTime(expire)}`);
    }

    results.push({
      title: `${node.name} ${percent}%`,
      content: content.join("\n"),
      icon: node.icon || "airplane.circle",
      "icon-color": node.color || "#FFB6C1"
    });
  }

  $done({ content: results });
})();

// ------------------- 工具函数 -------------------

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

// 动态获取节点信息，适配 RESET_Dayx
function getDynamicNodes(args) {
  let nodes = [];
  for (let key in args) {
    let match = key.match(/^NAME(\d+)$/);
    if (match) {
      let i = match[1];
      if (args[`NAME${i}`] && args[`URL${i}`]) {
        nodes.push({
          name: args[`NAME${i}`],
          url: args[`URL${i}`],
          reset: args[`RESET_Day${i}`], // 修改这里
          expire: args[`EXPIRE${i}`],
          icon: args[`ICON${i}`],
          color: args[`COLOR${i}`]
        });
      }
    }
  }
  return nodes;
}

function getUserInfo(url) {
  let request = { headers: { "User-Agent": "Quantumult%20X" }, url };
  return new Promise((resolve, reject) =>
    $httpClient.head(request, (err, resp) => {
      if (err != null) {
        reject(err);
        return;
      }
      if (resp.status !== 200) {
        reject(resp.status);
        return;
      }
      let header = Object.keys(resp.headers).find(
        (key) => key.toLowerCase() === "subscription-userinfo"
      );
      if (header) {
        resolve(resp.headers[header]);
        return;
      }
      reject("链接响应头不带有流量信息");
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

function getRemainingDays(resetDay) {
  if (!resetDay) return;

  let now = new Date();
  let today = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();
  let daysInMonth;

  if (resetDay > today) {
    daysInMonth = 0;
  } else {
    daysInMonth = new Date(year, month + 1, 0).getDate();
  }

  return daysInMonth - today + resetDay;
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatTime(time) {
  let dateObj = new Date(time);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  return year + "年" + month + "月" + day + "日";
}




