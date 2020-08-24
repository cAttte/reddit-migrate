const login = require("./login")

module.exports = async function getData(cli) {
    const old = await login(
        cli.credentials.OLD_CLIENT_ID,
        cli.credentials.OLD_CLIENT_SECRET,
        cli.credentials.OLD_USERNAME,
        cli.credentials.OLD_PASSWORD
    )
}