// Define the `main` function

function main(params) {
  const proxies = params.proxies;

  const extra = {
    "rule-providers": {
      reject: {
        type: "http",
        behavior: "domain",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
        path: "./ruleset/reject.yaml",
        interval: 86400,
      },         
      proxy: {
        type: "http",
        behavior: "domain",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
        path: "./ruleset/proxy.yaml",
        interval: 86400,
      },   
      direct: {
        type: "http",
        behavior: "domain",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
        path: "./ruleset/direct.yaml",
        interval: 86400,
      },
      gfw: {
        type: "http",
        behavior: "domain",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
        path: "./ruleset/gfw.yaml",
        interval: 86400,
      },
      "tld-not-cn": {
        type: "http",
        behavior: "domain",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
        path: "./ruleset/tld-not-cn.yaml",
        interval: 86400,
      },
      telegramcidr: {
        type: "http",
        behavior: "ipcidr",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
        path: "./ruleset/telegramcidr.yaml",
        interval: 86400,
      },
      cncidr: {
        type: "http",
        behavior: "ipcidr",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
        path: "./ruleset/cncidr.yaml",
        interval: 86400,
      },
      lancidr: {
        type: "http",
        behavior: "ipcidr",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
        path: "./ruleset/lancidr.yaml",
        interval: 86400,
      },
      applications: {
        type: "http",
        behavior: "classical",
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
        path: "./ruleset/applications.yaml",
        interval: 86400,
      },
      BanAD: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/BanAD.yaml",
        path: "./ruleset/BanAD.yaml",
        interval: 86400,
      },
      BanEasyList: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/BanEasyList.yaml",
        path: "./ruleset/BanEasyList.yaml",
        interval: 86400,
      },
      BanEasyListChina: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/BanEasyListChina.yaml",
        path: "./ruleset/BanEasyListChina.yaml",
        interval: 86400,
      },
      BanEasyPrivacy: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/BanEasyPrivacy.yaml",
        path: "./ruleset/BanEasyPrivacy.yaml",
        interval: 86400,
      },   
      OpenAI: {
        type: "http",
        behavior: "classical",
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
        path: "./ruleset/OpenAI.yaml",
        interval: 86400,
      },
      Whatsapp: {
        type: "http",
        behavior: "classical",
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Whatsapp/Whatsapp.yaml",
        path: "./ruleset/Whatsapp.yaml",
        interval: 86400,
      },   
      Google: {
        type: "http",
        behavior: "classical",
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml",
        path: "./ruleset/Google.yaml",
        interval: 86400,
      },  
      ProxyMedia: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/ProxyMedia.yaml",
        path: "./ruleset/ProxyMedia.yaml",
        interval: 86400,
      },
      Microsoft: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/Microsoft.yaml",
        path: "./ruleset/Microsoft.yaml",
        interval: 86400,
      },
      OneDrive: {
        type: "http",
        behavior: "domain",
        url: "https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Providers/OneDrive.yaml",
        path: "./ruleset/OneDrive.yaml",
        interval: 86400,
      },
    },
  };


  const extra_rules = [
    "DOMAIN-SUFFIX,mudaiba.com,DIRECT",
    "DOMAIN-SUFFIX,flaticon.com,DIRECT",
    "RULE-SET,telegramcidr,Telegram",
    "RULE-SET,OpenAI,OpenAI",
    "RULE-SET,Whatsapp,Whatsapp",    
    "RULE-SET,Google,Google",
    "RULE-SET,Microsoft,DIRECT",
    "RULE-SET,OneDrive,DIRECT",
    "RULE-SET,ProxyMedia,ProxyMedia",
    "RULE-SET,BanAD,Shield",
    "RULE-SET,BanEasyList,Shield",
    "RULE-SET,BanEasyListChina,Shield",
    "RULE-SET,BanEasyPrivacy,Privacy",
    "RULE-SET,lancidr,DIRECT",
    "RULE-SET,applications,DIRECT",
    "RULE-SET,cncidr,DIRECT",
    "RULE-SET,reject,REJECT",
    "RULE-SET,gfw,Proxies",
    "RULE-SET,tld-not-cn,Proxies",
    "MATCH,Proxies",
  ];

  const getProxies = (apper) => {
    if (Array.isArray(apper)) {
      return ["DIRECT", ...apper, ...proxies.map((item) => item.name)];
    } else {
      return ["DIRECT", ...proxies.map((item) => item.name)];
    }
  };

  const proxy_groups = [
    {
      name: "Proxies",
      type: "select",
      proxies: getProxies(),
      icon: "https://cdn-icons-png.flaticon.com/512/9985/9985721.png",
    },
    {
      name: "Telegram",
      type: "select",
      proxies: [...getProxies().slice(20,68)],
      icon: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
    },
    {
      name: "Google",
      type: "select",
      proxies: ["Proxies", ...getProxies()],
      icon: "https://cdn-icons-png.flaticon.com/512/2702/2702602.png",
    },
    {
      name: "OpenAI",
      type: "select",
      proxies: [...getProxies().slice(32,49)],
      icon: "https://cdn-icons-png.flaticon.com/512/12222/12222560.png",
    },
    {
      name: "Whatsapp",
      type: "select",
      proxies: [...getProxies().slice(40,49)],
      icon: "https://cdn-icons-png.flaticon.com/512/2585/2585165.png",
    },    
    {
      name: "ProxyMedia",
      type: "select",
      proxies: ["Proxies", ...getProxies()],
      icon: "https://cdn-icons-png.flaticon.com/128/6404/6404519.png",
    },
    {
      name: "Shield",
      type: "select",
      proxies: ["REJECT", "DIRECT"],
      icon: "https://cdn-icons-png.flaticon.com/512/9645/9645004.png",
    },
    {
      name: "Privacy",
      type: "select",
      proxies: ["REJECT", "DIRECT"],
      icon: "	https://cdn-icons-png.flaticon.com/512/4413/4413865.png",
    },
  ];

  extra.rules = extra_rules;
  extra["proxy-groups"] = proxy_groups;
  return { ...params, ...extra };
}
