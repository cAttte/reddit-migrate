const chalk = require("chalk")
const ora = require("ora")

const highlight = (string, color) => {
    const colorize = chalk[color]
    const colorizeBright = chalk[color + "Bright"]
    const highlighted = string.replace(/{(.+?)}/g, (_, $1) => colorizeBright($1))
    return colorize(highlighted)
}

module.exports = {
    orange: chalk.rgb(255, 69, 0),
    orangeString: "rgb(255,69,0)",
    bgOrange: chalk.bgRgb(255, 69, 0),
    bgOrangeString: "bgRgb(255,69,0)",
    blue: chalk.rgb(113, 147, 255),
    blueString: "rgb(113,147,255)",
    success(message) {
        console.log(highlight(message, "green"))
    },
    error(message, exit = true) {
        console.log(highlight(message, "red"))
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