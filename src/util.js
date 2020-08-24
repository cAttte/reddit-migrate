const stripANSI = require("strip-ansi")
const logSymbols = require("log-symbols")
const chalk = require("chalk")
const ora = require("ora")

// colors
const orange = chalk.rgb(255, 69, 0)
const orangeString = "rgb(255,69,0)"
const bgOrange = chalk.bgRgb(255, 69, 0)
const bgOrangeString = "bgRgb(255,69,0)"
const blue = chalk.rgb(113, 147, 255)
const blueString = "rgb(113,147,255)"

// symbols
const symbols = {
    ...logSymbols,
    info: blue(stripANSI(logSymbols.info))
}

// logging
function highlight(string, color) {
    const colorize = chalk[color + "Bright"]
    return string.replace(/{(.+?)}/g, (_, $1) => colorize($1))
}
function formatSuccess(message) {
    return highlight(message, "green")
}
function success(message) {
    console.log(`${symbols.success} ${formatSuccess(message)}`)
}
function formatWarning(message) {
    return highlight(message, "yellow")
}
function warning(message) {
    console.log(`${symbols.warning} ${formatWarning(message)}`)
}
function formatError(message) {
    return highlight(message, "red")
}
function error(message, exit) {
    console.log(`${symbols.error} ${formatError(message)}`)
    if (exit) process.exit(1)
}
function spin(message, options = {}) {
    const spinner = ora({
        text: highlight(message, "yellow"),
        spinner: "line",
        color: "yellow",
        ...options
    })
    return spinner.start()
}

module.exports = {
    orange,
    orangeString,
    bgOrange,
    bgOrangeString,
    blue,
    blueString,
    symbols,
    highlight,
    formatSuccess,
    success,
    formatWarning,
    warning,
    formatError,
    error,
    spin
}