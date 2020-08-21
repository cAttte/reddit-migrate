const { stripIndent } = require("common-tags")
const chalk = require("chalk")

module.exports = function() {
    this.options.unshift({ flags: this._helpFlags, description: this._helpDescription })
    const help = stripIndent(chalk`
        {rgb(255,69,0) reddit-migrate} {bgRgb(255,69,0)  }

        {bold Usage:}
            reddit-migrate {rgb(113,147,255) [options]}

        {bold Options:}
            ${
                this.options.map(option =>
                    option.flags.padEnd(32) + chalk.rgb(113, 147, 255)(option.description)
                ).join("\n" + " ".repeat(12))
            }
        {reset  }
    `)
    this.options.shift()
    return help
}