"use strict";

module.exports = core;

const colors = require("colors/safe");
const semver = require("semver");
const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");
const log = require("@bekacode/log");
const { LOWEST_NODE_VERSION, DEFUALT_CLI_HOME } = require("./constant");

const USER_HOME = require("os").homedir();

function core(argv) {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkHomeDir();
    checkInputArgs(argv);
    checkEnv();
  } catch (e) {
    log.error(e.message);
  }
}

function checkEnv() {
  const dotenvPath = path.resolve(USER_HOME, ".env");
  if (fs.existsSync(dotenvPath)) {
    require("dotenv").config({
      path: dotenvPath,
    }).parsed;
  }
  mergeConfig();
}

function mergeConfig() {
  const defaultConfig = {
    home: USER_HOME,
    cliHome: path.join(USER_HOME, DEFUALT_CLI_HOME),
  };
  process.env = Object.assign(defaultConfig, process.env);
}

function checkArgs(args) {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

function checkInputArgs(argv) {
  const args = require("minimist")(argv);
  checkArgs(args);
}

function checkHomeDir() {
  if (!USER_HOME || !fs.existsSync(USER_HOME)) {
    throw new Error(colors.red(`lego-cli 无法获取用户主目录`));
  }
}

// root 降级
function checkRoot() {
  if (process.geteuid() === 0) {
    require("root-check")();
  }
}

function checkNodeVersion() {
  const currentVersion = process.version;
  if (semver.lt(currentVersion, LOWEST_NODE_VERSION)) {
    throw new Error(
      colors.red(`lego-cli 需要安装${LOWEST_NODE_VERSION}以上的版本`)
    );
  }
}

function checkPkgVersion() {
  log.info("cli", pkg.version);
}
