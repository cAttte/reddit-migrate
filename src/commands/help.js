const { stripIndent } = require("common-tags")
const chalk = require("chalk")
const { error, blue, blueString } = require("../util")

module.exports = function helpCommand(commandName) {
    if (typeof commandName !== "string" || !commandName || commandName.toLowerCase() === "help") {
        console.log(stripIndent(chalk`
            {bold Usage:}
                reddit-migrate {${blueString} [command] [options]}

            {bold Commands:}
                ${
                    this.commands.map(command =>
                        `${command._name} [options]`.padEnd(20) + blue(command._description)
                    ).join("\n" + " ".repeat(16))
                }
        `))
    } else {
        const command = this.commands.find(c => c._name === commandName.toLowerCase())
        if (!command) error(`Unknown command {${commandName}}.`)
        console.log(stripIndent(chalk`
            ${command._description}

            {bold Usage:}
                ${command._name} {${blueString} [options]}

            {bold Options:}
                ${
                    command.options.map(option =>
                        `${option.flags}`.padEnd(24) + blue(option.description)
                    ).join("\n" + " ".repeat(16))
                }
        `))
    }
}