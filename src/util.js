const symbols = require("log-symbols")
const chalk = require("chalk")
const ora = require("ora")

const highlight = (string, color) => {
    const colorize = chalk[color]
    const colorizeBright = chalk[color + "Bright"]
    const highlighted = string.replace(/{(.+?)}/g, (_, $1) => colorizeBright($1))
    return colorize(highlighted)
}

const util = {
    // colors
    orange: chalk.rgb(255, 69, 0),
    orangeString: "rgb(255,69,0)",
    bgOrange: chalk.bgRgb(255, 69, 0),
    bgOrangeString: "bgRgb(255,69,0)",
    blue: chalk.rgb(113, 147, 255),
    blueString: "rgb(113,147,255)",

    // symbols
    symbols: symbols,

    // logging
    formatSuccess(message) {
        return highlight(message, "green")
    },
    success(message) {
        console.log(`${util.symbols.success} ${util.formatSuccess(message)}`)
    },
    formatError(message) {
        return highlight(message, "red")
    },
    error(message, exit) {
        console.log(`${util.symbols.error} ${util.formatError(message)}`)
        if (exit) process.exit(1)
    },
    spin(message, options = {}) {
        const spinner = ora({
            text: highlight(message, "yellow"),
            spinner: "line",
            color: "yellow",
            ...options
        })
        return spinner.start()
    }
}

module.exports = util