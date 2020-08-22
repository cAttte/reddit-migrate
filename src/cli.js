#!/usr/bin/env node
const chalk = require("chalk")
const cli = require("commander").program

cli.helpInformation = require("./help")
const loadCredentials = require("./credentials/load")

process.on("unhandledRejection", error => {
    console.log(chalk`{red Unexpected Error:} {redBright ${error.message}}`)
    const stack = chalk.gray((error.stack.match(/\n    at(.+(reddit-migrate.src).+)/g) || []).join("\n"))
    console.log(stack)
})

async function main() {
    cli
        .helpOption("-h, --help", "Display command help")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .option("-i, --input <path>", "Path of input file to load data from")
        .option("-o, --output <path>", "Path of output file for retrieved data")
        .option("-m, --import", "Whether to only import data; not migrate from a new account")
        .option("-x, --export", "Whether to only export data; not migrate to a new account")
    cli.parse(process.argv)
    if (cli.import && cli.export) {
        console.log(chalk`{red Only one of {redBright --import} and {redBright --export} can be specified.}`)
        process.exit(1)
    }

    const credentials = await loadCredentials(cli)
}

main()