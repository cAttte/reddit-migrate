const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const dotenv = require("dotenv")
const inquirer = require("inquirer")
const validateCredentials = require("./validate")
const { symbols, blue, formatSuccess, formatError, spin } = require("../util")

const prettify = (name) => name.replace(/_/g, " ").toLowerCase()

function askValue(name, questionPrefix, oldValue) {
    const question = chalk`{reset ${questionPrefix}, what's the} {bold ${prettify(name)}}?`
    return inquirer.prompt({
        name: name,
        message: question,
        prefix: symbols.info,
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
    let credentialNames = []
    if (cli.export || !cli.import)
        credentialNames = credentialNames.concat(credentials.map(c => "OLD_" + c))
    if (cli.import || !cli.export)
        credentialNames = credentialNames.concat(credentials.map(c => "NEW_" + c))

    const filepath = cli.envFile
    let fileRead = false
    const env = {}
    if (filepath) {
        const spinner = spin(`Loading {${filepath}}...`)
        const buffer = await fs.promises.readFile(path.resolve(filepath))
            .catch(() => { spinner.fail(formatError(`Couldn't read {${filepath}}.`)) })
        if (buffer) {
            const parsed = dotenv.parse(buffer)
            Object.assign(env, parsed)
            fileRead = true
            spinner.succeed(formatSuccess(`Loaded {${filepath}}.`))
        }
    }

    if (!filepath && !process.stdin.isTTY)
        error("Env file not provided.")

    for (name of credentialNames) {
        const oldName = name.startsWith("NEW") ? name.replace("NEW", "OLD") : null
        if (!env[name]) {
            if (!process.stdin.isTTY)
                error(`{${name}} not provided in env file.`)
            const answer = await askValue(name, fileRead ? "Not provided in env file" : "Env file not provided", env[oldName])
            env[name] = answer[name]
        } else {
            const error = validateCredentials(name, env[name], env[oldName])
            if (typeof error === "string") {
                error(`{${name}:} ${error}`, false)
                const answer = await askValue(name, "Invalid value")
                env[name] = answer[name]
            }
        }
    }

    return env
}