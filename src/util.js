const chalk = require("chalk")
const { Spinner } = require("cli-spinner")

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
    error(message, exit = true) {
        console.log(highlight(message, "red"))
        if (exit) process.exit(1)
    },
    spin(message) {
        const spinner = new Spinner()
            .setSpinnerTitle(highlight("%s " + message, "yellow"))
            .setSpinnerString(0)
            .start()
        return spinner
    }
}