const { highlight, formatSuccess, formatError, spin, error } = require("../../util")

module.exports = async function importSubscriptions(reddit, data) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No subreddits to subscribe to.", false)
    const spinner = spin("Subscribing to subreddits...")
    let succeeded = 0
    let failed = 0
    for (i = 0; i < data.length; i++) {
        const name = data[i]
        const sub = await reddit.getSubreddit(name)
        await sub.subscribe()
            .then(() => succeeded++)
            .catch(() => failed++)
        spinner.text = highlight(`Subscribing to {${succeeded}} subreddits...`, "yellow")
            + (failed ? highlight(` ({${failed}} failed)`, "red") : "")
    }
    if (!succeeded)
        spinner.fail(formatError(`Couldn't subscribe to {${failed}} subreddits.`))
    else
        spinner.succeed(formatSuccess(`Subscribed to {${succeeded}} subreddits.`)
            + (failed ? formatError(` Couldn't subscribe to {${failed}}.`) : ""))
}