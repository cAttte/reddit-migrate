const package = require("../package.json")
const { success, error, spin } = require("./util")
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
        spinner.stop(true)
        error(`Couldn't log in as {${username}}: {${message}}`)
    })

    spinner.stop(true)
    success(`Successfully logged in as {${username}}.`)
    return reddit
}