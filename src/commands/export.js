const fs = require("fs/promises")
const path = require("path")
const chalk = require("chalk")
const inquirer = require("inquirer")

const { spin, formatSuccess, formatError, error, symbols, blue } = require("../util")
const loadCredentials = require("../credentials/load")
const login = require("../login")
const exportData = require("../data/export")

module.exports = async function exportCommand(self) {
    const credentials = await loadCredentials(self, false)
    const reddit = await login(credentials)
    const data = await exportData(reddit, self.which)
    const output = path.resolve(self.output)
    const spinner = spin(`Saving data to {${output}}...`)

    let write = true
    const exists = await fs.stat(output).catch(() => false)
    if (exists) {
        spinner.stop()
        const { overwrite } = await inquirer.prompt({
            name: "overwrite",
            type: "confirm",
            message: chalk.reset(`Overwrite ${blue(self.output)}?`),
            prefix: symbols.info
        })
        write = overwrite
    }

    if (write)
        await fs.writeFile(output, JSON.stringify(data, null, self.pretty ? 4 : 0))
            .then(() => spinner.succeed(formatSuccess(`Saved data to {${output}}.`)))
            .catch(e => spinner.fail(formatError(`Couldn't save data to {${output}}: ${e.message}`)))
    else
        error(`Couldn't save data to {${output}}: File already exists.`, false)
}