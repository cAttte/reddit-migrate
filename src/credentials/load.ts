import fs from "fs"
import path from "path"
import chalk from "chalk"
import dotenv from "dotenv"
import inquirer from "inquirer"
// "what a glorious set of stairs we make!"
import validateCredentials from "./validate"
import { symbols, blue, formatSuccess, formatError, spin, error } from "../util"
import commander from "commander"

const isSecret = (name: string) => name.endsWith("PASSWORD") || name.endsWith("SECRET")
const humanize = (name: string) => name.replace(/_/g, " ").toLowerCase()
const censor = (string: string) => "*".repeat(string.length)

function askValue(name: string, questionPrefix: string, oldValue?: string) {
    name = humanize(name)
    const question = chalk`{reset ${questionPrefix}, what's the} {bold ${name}}?`
    return inquirer.prompt({
        name: name,
        message: question,
        prefix: symbols.info,
        validate: (input: string) => validateCredentials(name, input, oldValue),
        transformer: (input: string) => blue(isSecret(name) ? censor(input) : input)
    })
}

const credentials = ["CLIENT_ID", "CLIENT_SECRET", "USERNAME", "PASSWORD"]
export default async function loadCredentials(
    command: commander.Command,
    needBoth: boolean
) {
    const credentialNames = needBoth
        ? credentials.map(c => "OLD_" + c).concat(credentials.map(c => "NEW_" + c))
        : credentials

    const filepath = command.envFile
    let fileRead = false
    const env = {}

    if (filepath) {
        const spinner = spin(`Loading {${filepath}}...`)
        const buffer = await fs.promises
            .readFile(path.resolve(filepath))
            .catch(() => spinner.fail(formatError(`Couldn't read {${filepath}}.`)))

        if (buffer instanceof Buffer) {
            const parsed = dotenv.parse(buffer)
            Object.assign(env, parsed)
            spinner.succeed(formatSuccess(`Loaded {${filepath}}.\n`))
            fileRead = true
        }
    }

    if (!filepath && !process.stdin.isTTY) error("Env file not provided.")

    for (const name of credentialNames) {
        const oldName = name.startsWith("NEW") ? name.replace("NEW_", "OLD_") : null
        if (!env[name]) {
            if (!process.stdin.isTTY) error(`{${name}} not provided in env file.`)
            const answer = await askValue(
                name,
                fileRead ? "Not provided in env file" : "Env file not provided",
                env[oldName]
            )
            env[name] = answer[name]
        } else {
            const errorMessage = validateCredentials(name, env[name], env[oldName])
            if (typeof errorMessage === "string") {
                error(`{${name}:} ${error}`, false)
                const answer = await askValue(name, "Invalid value")
                env[name] = answer[name]
            }
        }
    }

    return env
}
