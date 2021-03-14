import fs from "fs"
import path from "path"
import RedditMigrate from "../RedditMigrate"
import loadCredentials from "../credentials/load"
import login from "../login"
import importData from "../data/import"
import Which from "../data/interfaces/Which"
import { spin, formatSuccess, formatError } from "../util"

export default async function importCommand(self: RedditMigrate) {
    const credentials = await loadCredentials(self, false)
    const reddit = await login(credentials)
    const input = path.resolve(self.input)
    const spinner = spin(`Reading data from {${input}}...`)
    const data = await fs.promises
        .readFile(input)
        .then(input => JSON.parse(input.toString()))
        .catch(e => {
            spinner.fail(
                formatError(
                    `Couldn't read {${input}}: ${e.message.replace(/, open.+/, "")}`
                )
            )
            process.exit(1)
        })
    spinner.succeed(formatSuccess(`Read data from {${input}}.`))

    const exportDate = data.exported_at ? new Date(data.exported_at) : NaN
    // isNaN() works with Dates too
    if (!isNaN(exportDate as number))
        console.log(formatSuccess(`  Exported at {${exportDate}}.`))

    await importData(reddit, data, self.which as Which<false>)
}
