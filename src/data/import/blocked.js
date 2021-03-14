const { highlight, formatSuccess, formatError, spin, error } = require("../../util")

// snoowrap doesn't support the block_user endpoint...
function block(user) {
    return user._post({
        uri: `api/block_user`,
        form: {
            name: user.name
        }
    })
}

module.exports = async function importBlocked(reddit, data) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No users to block.", false)

    const spinner = spin("Blocking users...")
    let succeeded = 0
    let failed = 0
    for (username of data) {
        const user = await reddit.getUser(username)
        await block(user)
            .then(() => succeeded++)
            .catch(() => failed++)
        spinner.text =
            highlight(`Blocking {${succeeded}} users...`, "yellow") +
            (failed ? highlight(` ({${failed}} failed)`, "red") : "")
    }
    if (!succeeded) spinner.fail(formatError(`Couldn't block {${failed}} users.`))
    else
        spinner.succeed(
            formatSuccess(`Blocked {${succeeded}} users.`) +
                (failed ? formatError(` Couldn't block {${failed}}.`) : "")
        )
}
