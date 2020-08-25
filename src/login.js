const package = require("../package.json")
const { formatSuccess, formatError, spin } = require("./util")
const Snoowrap = require("snoowrap")

module.exports = async function login(credentials, prefix = "") {
    const username = credentials[prefix + "USERNAME"]
    const spinner = spin(`Attempting to login as {${username}}...`)

    const reddit = new Snoowrap({
        userAgent: `reddit-migrate@${package.version} | github.com/cAttte/reddit-migrate`,
        clientId: credentials[prefix + "CLIENT_ID"],
        clientSecret: credentials[prefix + "CLIENT_SECRET"],
        username: credentials[prefix + "USERNAME"],
        password: credentials[prefix + "PASSWORD"]
    })

    await reddit.getMe().catch(() => {
        spinner.fail(formatError(`Couldn't log in as {${username}}.`))
        process.exit(1)
    })

    spinner.succeed(formatSuccess(`Successfully logged in as {${username}}.`))
    return reddit
}