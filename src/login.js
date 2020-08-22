const package = require("../package.json")
const chalk = require("chalk")
const { Spinner } = require("cli-spinner")
const Snoowrap = require("snoowrap")

module.exports = async function login(id, secret, username, password) {
    const spinner = new Spinner()
        .setSpinnerTitle(chalk`{yellow %s Attempting to login as} {yellowBright ${username}}{yellow ...}`)
        .setSpinnerString(0)
        .start()

    const reddit = new Snoowrap({
        userAgent: `reddit-migrate@${package.version} | github.com/cAttte/reddit-migrate`,
        clientId: id,
        clientSecret: secret,
        username: username,
        password: password
    })

    await reddit.getMe().catch(({ message }) => {
        spinner.stop(true)
        console.log(chalk`{red Couldn't log in as} {redBright ${username}}{red :} {redBright ${message}}{red .}`)
        process.exit(1)
    })

    spinner.stop(true)
    console.log(chalk`{green Successfully logged in as} {greenBright ${username}}{green .}`)
    return reddit
}