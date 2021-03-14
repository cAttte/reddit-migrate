#!/usr/bin/env node
import chalk from "chalk"
import { program as cli } from "commander"
import { Attributes } from "./data/Attributes"

import { orangeString, bgOrangeString, error } from "./util"
import helpCommand from "./commands/help"
import migrateCommand from "./commands/migrate"
import exportCommand from "./commands/export"
import importCommand from "./commands/import"
import purgeCommand from "./commands/purge"
import override from "./overrides"

process.on("unhandledRejection", (info: { message: string; stack: string }) => {
    const { message, stack } = info
    const regex = /    at(.+(reddit-migrate.src).+)/g
    const prettyStack = chalk.gray((stack.match(regex) || []).join("\n"))

    console.log(error(`Unexpected Error: {${message}}`))
    console.log(prettyStack)
    process.exit(1)
})

function handleWhich(value: string) {
    const result: Partial<Record<keyof Attributes, true>> = {}
    const inputAttributes = value.toLowerCase().split(",")
    for (const input of inputAttributes)
        if (!Object.keys(Attributes).includes(input) && input !== "all")
            error(`Unknown data attribute {${input}}.`)
    for (const attribute of Object.keys(Attributes))
        if (inputAttributes.includes(attribute) || value.toLowerCase() === "all")
            inputAttributes[attribute] = true
    return result
}

const submissionTypes = ["posts", "comments", "all"]
function handlePurgeWhich(value: string): Partial<Record<"posts" | "comments", true>> {
    value = value.toLowerCase()
    if (!submissionTypes.includes(value))
        error(`{--which} must be 'posts', 'comments', or 'all'.`)

    if (value === "posts") return { posts: true }
    else if (value === "comments") return { comments: true }
    else return { posts: true, comments: true }
}

async function main() {
    console.log(chalk`{${orangeString} reddit-migrate} {${bgOrangeString}  }\n`)

    cli.name("reddit-migrate").usage("[command] [options]").action(helpCommand.bind(cli))
    override(cli)

    cli.command("help [command]")
        .description("Display command help")
        .action(helpCommand.bind(cli))

    cli.command("migrate")
        .description("Migrate to a new reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .option(
            "-?, --which <list>",
            "A comma-separated list of attributes to migrate, or 'all'",
            handleWhich,
            handleWhich("all")
        )
        .action(migrateCommand.bind(cli))

    cli.command("export")
        .description("Export data from a reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .requiredOption("-o, --output <path>", "Path of output file")
        .option("-p, --pretty", "Whether to prettify the output JSON")
        .option("-w, --overwrite", "Avoid the 'overwrite?' prompt if file already exists")
        .option(
            "-?, --which <list>",
            "A comma-separated list of attributes to export, or 'all'",
            handleWhich,
            handleWhich("all")
        )
        .action(exportCommand.bind(cli))

    cli.command("import")
        .description("Import data to a reddit account")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .requiredOption("-i, --input <path>", "Path of input file")
        .option(
            "-?, --which <list>",
            "A comma-separated list of attributes to import, or 'all'",
            handleWhich,
            handleWhich("all")
        )
        .action(importCommand.bind(cli))

    cli.command("purge")
        .description("Mass-delete reddit account content")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from")
        .option("-d, --edit <text>", "Text to edit messages and posts to before deleting")
        .option(
            "-?, --which <type>",
            "Submission type to delete; 'posts', 'comments', or 'all'",
            handlePurgeWhich,
            handlePurgeWhich("all")
        )
        .action(purgeCommand.bind(cli))

    cli.commands.forEach(override)
    cli.parse(process.argv)
}

main()
