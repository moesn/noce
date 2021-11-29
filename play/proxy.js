const PROXY_CONFIG = {
  "/basic-": {
    "target": "http://10.12.2.156:8888/",
    "secure": false,
  },
  "/api/sf": {
    "target": "http://10.3.37.16:9000",
    "secure": false,
    "bypass": function (req) {
      req.headers["Readdr"] = req.headers.host.split(':')[0];
    }
  },
};

module.exports = PROXY_CONFIG;
