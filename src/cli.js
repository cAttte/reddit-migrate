#!/usr/bin/env node
const chalk = require("chalk")
const cli = require("commander").program

cli.helpInformation = require("./help")
const { orangeString, bgOrangeString, error } = require("./util")
const loadCredentials = require("./credentials/load")
const getData = require("./get-data")

process.on("unhandledRejection", ({ message, stack }) => {
    console.log(error(`Unexpected Error: {${message}}`))
    const prettyStack = chalk.gray((stack.match(/    at(.+(reddit-migrate.src).+)/g) || []).join("\n"))
    console.log(prettyStack)
    process.exit(1)
})

async function main() {
    console.log(chalk`{${orangeString} reddit-migrate} {${bgOrangeString}  }\n`)

    cli
        .helpOption("-h, --help", "Display command help")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .option("-m, --import", "Whether to only import data; not migrate from a new account")
        .option("-x, --export", "Whether to only export data; not migrate to a new account")
        .option("-i, --input <path>", "Path of input file to import data from")
        .option("-o, --output <path>", "Path of output file to export data to")

    cli.parse(process.argv)
    if (cli.import && cli.export)
        error("Only one of {--import} and {--export} can be specified.")
    if (cli.import && !cli.input)
        error("{--input} must be specified when {--import} is present.")
    if (cli.export && !cli.output)
        error("{--output} must be specified when {--export} is present.")
    cli.migrate = !cli.import && !cli.export

    cli.credentials = await loadCredentials(cli)

    if (cli.migrate) {
        const data = await getData(cli)
    }
}

main()