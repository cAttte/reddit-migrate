const fs = require("fs/promises")
const path = require("path")

const { spin, formatSuccess, formatError } = require("../util")
const loadCredentials = require("../credentials/load")
const login = require("../login")
const importData = require("../data/import")

module.exports = async function importCommand(self) {
    const credentials = await loadCredentials(this, false)
    const reddit = await login(credentials)
    const input = path.resolve(self.input)
    const spinner = spin(`Reading data from {${input}}...`)
    const data = await fs.readFile(input)
        .then(input => JSON.parse(input))
        .catch(e => {
            spinner.fail(formatError(`Couldn't read {${input}}: ${e.message.replace(/, open.+/, "")}`))
            process.exit(1)
        })
    spinner.succeed(formatSuccess(`Read data from {${input}}.`))

    const exportDate = data.exported_at ? new Date(data.exported_at) : NaN
    if (!isNaN(exportDate)) console.log(formatSuccess(`  Exported at {${exportDate}}.`))

    await importData(reddit, data, self.which)
}