const stripANSI = require("strip-ansi")
const logSymbols = require("log-symbols")
const chalk = require("chalk")
const ora = require("ora")

const noop = () => {}

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
const highlight = (string, color) => string.replace(/{(.+?)}/g, (_, $1) => chalk[color + "Bright"]($1))
const formatSuccess = message => highlight(message, "green")
const success = message => console.log(`${symbols.success} ${formatSuccess(message)}`)
const formatWarning = message => highlight(message, "yellow")
const warning = message => console.log(`${symbols.warning} ${formatWarning(message)}`)
const formatError = message => highlight(message, "red")
const error = (message, exit = true) => {
    if (process.spinner) process.spinner.stop()
    console.log(`${symbols.error} ${formatError(message)}`)
    if (exit) process.exit(1)
}
const spin = (message, options = {}) => {
    const spinner = ora({
        text: highlight(message, "yellow"),
        spinner: "line",
        color: "yellow",
        ...options
    })
    process.spinner = spinner
    return spinner.start()
}

module.exports = {
    noop,
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