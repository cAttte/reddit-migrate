const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const dotenv = require("dotenv")
const inquirer = require("inquirer")
const validateCredentials = require("./validate-credentials")
const { blue, orangeString } = require("./util")

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
            return blue(name.endsWith("PASSWORD") ? "*".repeat(input.length) : input)
        }
    })
}

const credentialNames = ["OLD_USERNAME", "OLD_PASSWORD", "NEW_USERNAME", "NEW_PASSWORD"]
module.exports = async function(filepath) {
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