#!/usr/bin/env node
const chalk = require("chalk")
const cli = require("commander").program

const { orangeString, bgOrangeString, error } = require("./util")
const helpCommand = require("./commands/help")
const migrateCommand = require("./commands/migrate")
const exportCommand = require("./commands/export")
const importCommand = require("./commands/import")

process.on("unhandledRejection", ({ message, stack }) => {
    console.log(error(`Unexpected Error: {${message}}`))
    const prettyStack = chalk.gray((stack.match(/    at(.+(reddit-migrate.src).+)/g) || []).join("\n"))
    console.log(prettyStack)
    process.exit(1)
})

async function main() {
    console.log(chalk`{${orangeString} reddit-migrate} {${bgOrangeString}  }\n`)

    cli.name("reddit-migrate")
        .usage("<command> [options]")
        .command("help [command]")
        .description("Display command help")
        .action(helpCommand.bind(cli))

    cli.command("migrate")
        .description("Migrate to a new reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .action(migrateCommand.bind(cli))

    cli.command("export")
        .description("Export data from a reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .requiredOption("-o, --output <path>", "Path of output file")
        .action(exportCommand.bind(cli))

    cli.command("import")
        .description("Import data to a reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .requiredOption("-i, --input <path>", "Path of input file")
        .action(importCommand.bind(cli))

    cli.parse(process.argv)
}

main()