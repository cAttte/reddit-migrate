#!/usr/bin/env node
const chalk = require("chalk")
const { orangeString, bgOrangeString, error } = require("./util")
const cli = require("commander").program

cli.helpInformation = require("./help")
const loadCredentials = require("./credentials/load")

process.on("unhandledRejection", ({ message, stack }) => {
    console.log(error(`Unexpected Error: {${message}}`))
    const prettyStack = chalk.gray((stack.match(/    at(.+(reddit-migrate.src).+)/g) || []).join("\n"))
    console.log(prettyStack)
})

async function main() {
    console.log(chalk`{${orangeString} reddit-migrate} {${bgOrangeString}  }\n`)

    cli
        .helpOption("-h, --help", "Display command help")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .option("-i, --input <path>", "Path of input file to load data from")
        .option("-o, --output <path>", "Path of output file for retrieved data")
        .option("-m, --import", "Whether to only import data; not migrate from a new account")
        .option("-x, --export", "Whether to only export data; not migrate to a new account")
    cli.parse(process.argv)
    if (cli.import && cli.export)
        error("Only one of {--import} and {--export} can be specified.")

    const credentials = await loadCredentials(cli)
}

main()