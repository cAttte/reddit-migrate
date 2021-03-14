const { highlight, formatSuccess, formatError, spin, error } = require("../../util")

module.exports = async function importFriends(reddit, data) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No users to friend.", false)

    const spinner = spin("Friending users...")
    let succeeded = 0
    let failed = 0
    for (username of data) {
        const user = await reddit.getUser(username)
        await user
            .friend()
            .then(() => succeeded++)
            .catch(() => failed++)
        spinner.text =
            highlight(`Friending {${succeeded}} users...`, "yellow") +
            (failed ? highlight(` ({${failed}} failed)`, "red") : "")
    }
    if (!succeeded) spinner.fail(formatError(`Couldn't friend {${failed}} users.`))
    else
        spinner.succeed(
            formatSuccess(`Friended {${succeeded}} users.`) +
                (failed ? formatError(` Couldn't friend {${failed}}.`) : "")
        )
}
