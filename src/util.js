const chalk = require("chalk")

module.exports = {
    orange: chalk.rgb(255, 69, 0),
    orangeString: "rgb(255,69,0)",
    bgOrange: chalk.bgRgb(255, 69, 0),
    bgOrangeString: "bgRgb(255,69,0)",
    blue: chalk.rgb(113, 147, 255),
    blueString: "rgb(113,147,255)",
    error(message, exit = true) {
        const highlighted = message.replace(/{(.+)}/, (_, $1) => chalk.redBright($1))
        console.log(chalk.red(highlighted))
        if (exit) process.exit(1)
    }
}