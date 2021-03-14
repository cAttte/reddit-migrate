import fs from "fs"
import path from "path"
import chalk from "chalk"
import inquirer from "inquirer"
import RedditMigrate from "../RedditMigrate"
import loadCredentials from "../credentials/load"
import exportData from "../data/export"
import login from "../login"
import Which from "../data/interfaces/Which"
import { spin, formatSuccess, formatError, error, symbols, blue } from "../util"

export default async function exportCommand(self: RedditMigrate) {
    const credentials = await loadCredentials(self, false)
    const reddit = await login(credentials)
    const data = await exportData(reddit, self.which as Which)
    const output = path.resolve(self.output)
    const spinner = spin(`Saving data to {${output}}...`)

    let write = true
    const exists = await fs.promises.stat(output).catch(() => false)
    if (exists && !self.overwrite) {
        spinner.stop()
        if (!process.stdin.isTTY) {
            write = false
        } else {
            write = (
                await inquirer.prompt({
                    name: "overwrite",
                    type: "confirm",
                    message: chalk.reset(`Overwrite ${blue(self.output)}?`),
                    prefix: symbols.info
                })
            ).overwrite
        }
    }

    if (write)
        await fs.promises
            .writeFile(output, JSON.stringify(data, null, self.pretty ? 4 : 0))
            .then(() => spinner.succeed(formatSuccess(`Saved data to {${output}}.`)))
            .catch(e =>
                spinner.fail(
                    formatError(`Couldn't save data to {${output}}: ${e.message}`)
                )
            )
    else error(`Couldn't save data to {${output}}: File already exists.`, false)
}
