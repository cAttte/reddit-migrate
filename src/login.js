const package = require("../package.json")
const { formatSuccess, formatError, spin } = require("./util")
const Snoowrap = require("snoowrap")

module.exports = async function login(id, secret, username, password) {
    const spinner = spin(`Attempting to login as {${username}}...`)

    const reddit = new Snoowrap({
        userAgent: `reddit-migrate@${package.version} | github.com/cAttte/reddit-migrate`,
        clientId: id,
        clientSecret: secret,
        username: username,
        password: password
    })

    await reddit.getMe().catch(({ message }) => {
        spinner.fail(formatError(`Couldn't log in as {${username}}: {${message}}`))
        process.exit(1)
    })

    spinner.succeed(formatSuccess(`Successfully logged in as {${username}}.`))
    return reddit
}