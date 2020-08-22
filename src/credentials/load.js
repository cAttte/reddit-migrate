const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const dotenv = require("dotenv")
const inquirer = require("inquirer")
const validateCredentials = require("./validate")
const { blue, orangeString } = require("../util")

const prettify = (name) => name.replace(/_/g, " ").toLowerCase()

function askValue(name, questionPrefix, oldValue) {
    const question = chalk`{reset ${questionPrefix}, what's the} {bold ${prettify(name)}}?`
    return inquirer.prompt({
        name: name,
        message: question,
        prefix: chalk`{${orangeString} *}`,
        validate(input) {
            return validateCredentials(name, input, oldValue)
        },
        transformer(input) {
            return blue(name.endsWith("PASSWORD") || name.endsWith("SECRET") ?
                "*".repeat(input.length) : input)
        }
    })
}

const credentials = ["CLIENT_ID", "CLIENT_SECRET", "USERNAME", "PASSWORD"]
module.exports = async function loadCredentials(cli) {
    const credentialNames = credentials
        .map(n => "OLD_" + n)
        .concat(cli.export ? [] : credentials.map(n => "NEW_" + n))
    const filepath = cli.envFile
    let fileRead = false
    const env = {}
    if (filepath) {
        const buffer = await fs.promises.readFile(path.resolve(filepath))
            .catch(() => console.log(chalk`{red Couldn't read file {redBright ${filepath}}.}`))
        if (buffer) {
            const parsed = dotenv.parse(buffer)
            Object.assign(env, parsed)
            fileRead = true
            console.log(chalk`{green Loaded {greenBright ${filepath}}.}`)
        }
    }

    if (!filepath && !process.stdin.isTTY) {
        console.log(chalk.red("Env file not provided."))
        process.exit(1)
    }

    for (name of credentialNames) {
        const oldName = name.startsWith("NEW") ? name.replace("NEW", "OLD") : null
        if (!env[name]) {
            if (!process.stdin.isTTY) {
                console.log(chalk`{red {redBright ${name}} not provided in env file.}`)
                process.exit(1)
            }
            const answer = await askValue(name, fileRead ? "Not provided in env file" : "Env file not provided", env[oldName])
            env[name] = answer[name]
        } else {
            const error = validateCredentials(name, env[name], env[oldName])
            if (typeof error === "string") {
                console.log(chalk`{redBright ${name}:} {red ${error}}`)
                const answer = await askValue(name, "Invalid value")
                env[name] = answer[name]
            }
        }
    }

    return env
}