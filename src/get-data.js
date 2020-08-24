const fs = require("fs/promises")
const path = require("path")
const login = require("./login")
const exportData = require("./data/export")
const { spin, formatError, formatSuccess } = require("./util")

module.exports = async function getData(cli) {
    console.log()
    if (cli.import) {
        const input = path.resolve(cli.input)
        const spinner = spin(`Reading data from {${input}}...`)
        const data = await fs.readFile(input)
            .then(() => spinner.succeed(formatSuccess(`Read data from {${input}}.`)))
            .catch(() => spinner.fail(formatError(`Couldn't read {${input}}.`)))
        return data
    } else if (cli.export || cli.migrate) {
        const reddit = await login(
            cli.credentials.OLD_CLIENT_ID,
            cli.credentials.OLD_CLIENT_SECRET,
            cli.credentials.OLD_USERNAME,
            cli.credentials.OLD_PASSWORD
        )
        const data = await exportData(reddit)
        if (cli.output) {
            const output = path.resolve(cli.output)
            const spinner = spin(`Saving data to {${output}}...`)
            await fs.writeFile(output, JSON.stringify(data))
                .then(() => spinner.succeed(formatSuccess(`Saved data to {${output}}.`)))
                .catch(e => spinner.fail(formatError(e.message)))
        }
        return data
    }
    console.log()
}