#!/usr/bin/env node
const chalk = require("chalk")
const cli = require("commander").program

cli.helpInformation = require("./help")
// const loadCredentials = require("./load-credentials")

process.on("unhandledRejection", error => {
    console.log(chalk`{red Unexpected Error:} {redBright ${error.message}}`)
    const stack = chalk.gray(error.stack.match(/(\n    at(.+(reddit-migrate.src).+))+/g).join("\n"))
    console.log(stack)
})

async function main() {
    cli
        .helpOption("-h, --help", "Display command help")
        .option("-e, --env-file <path>", "Path of the .env file to load credentials from", )
        .option("-s, --subreddit-output <path>", "Path of output file for retrieved subreddits")
        .option("-r, --register", "Whether to register a new account with the provided new credentials")

    cli.parse(process.argv)
    // await loadCredentials(cli.envFile)
}

main()