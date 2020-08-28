#!/usr/bin/env node
const chalk = require("chalk")
const cli = require("commander").program

const { orangeString, bgOrangeString, error } = require("./util")
const helpCommand = require("./commands/help")
const migrateCommand = require("./commands/migrate")
const exportCommand = require("./commands/export")
const importCommand = require("./commands/import")
const override = require("./overrides")

process.on("unhandledRejection", ({ message, stack }) => {
    console.log(error(`Unexpected Error: {${message}}`))
    const prettyStack = chalk.gray((stack.match(/    at(.+(reddit-migrate.src).+)/g) || []).join("\n"))
    console.log(prettyStack)
    process.exit(1)
})

const attributes = ["subscriptions", "follows", "friends", "blocked", "multireddits", "profile", "preferences"]
function handleWhich(value) {
    const result = {}
    const array = value.toLowerCase().split(",")
    for (inputAttribute of array)
        if (!attributes.includes(inputAttribute) && inputAttribute !== "all")
            error(`Unknown data attribute {${inputAttribute}}.`)
    for (attribute of attributes)
        if (array.includes(attribute) || value.toLowerCase() === "all")
            result[attribute] = true
    return result
}

async function main() {
    console.log(chalk`{${orangeString} reddit-migrate} {${bgOrangeString}  }\n`)

    cli.name("reddit-migrate")
        .usage("[command] [options]")
        .action(helpCommand.bind(cli))
        .helpOption(`--${Math.random()}`, "")
            // this is kinda the only way i thought of to "remove" the help option...
    override(cli)

    cli.command("help [command]")
        .description("Display command help")
        .action(helpCommand.bind(cli))

    cli.command("migrate")
        .description("Migrate to a new reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .option("-?, --which <list>", "A comma-separated list of attributes to migrate, or 'all'", handleWhich, "all")
        .action(migrateCommand.bind(cli))

    cli.command("export")
        .description("Export data from a reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .requiredOption("-o, --output <path>", "Path of output file")
        .option("-p, --pretty", "Whether to prettify the output JSON")
        .option("-w, --overwrite", "Avoid the 'overwrite?' prompt if file already exists")
        .option("-?, --which <list>", "A comma-separated list of attributes to export, or 'all'", handleWhich, "all")
        .action(exportCommand.bind(cli))

    cli.command("import")
        .description("Import data to a reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .requiredOption("-i, --input <path>", "Path of input file")
        .option("-?, --which <list>", "A comma-separated list of attributes to import, or 'all'", handleWhich, "all")
        .action(importCommand.bind(cli))

    cli.commands = cli.commands
        .map(c => c.helpOption(`--${Math.random()}`, ""))
        .map(override)
    cli.parse(process.argv)
}

main()