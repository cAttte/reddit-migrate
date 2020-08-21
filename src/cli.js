#!/usr/bin/env node
const dotenv = require("dotenv")
const chalk = require("chalk")
const cli = require("commander").program

cli.helpInformation = require("./help")
// const loadCredentials = require("./load-credentials")

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