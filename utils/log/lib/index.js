"use strict";

const log = require("npmlog");

log.level = process.env.LOG_LEVEL || "info";

log.addLevel("success", 2000, { fg: "green" });

log.heading = "lego";
log.headingStyle = { fg: "black", bg: "white" };

module.exports = log;
