const { highlight, formatSuccess, formatError, spin, error } = require("../../util")

async function subscribe(reddit, data, { action, actioning, actioned, object }) {
    if (!data || !Array.isArray(data) || !data.length)
        return error(`No ${object}s to ${action}.`, false)

    const spinner = spin(`${actioning} ${object}s...`)
    let succeeded = 0
    let failed = 0
    for (name of data) {
        const sub = await reddit.getSubreddit(name)
        await sub.subscribe()
            .then(() => succeeded++)
            .catch(() => failed++)
        spinner.text = highlight(`${actioning} {${succeeded}} ${object}s...`, "yellow")
            + (failed ? highlight(` ({${failed}} failed)`, "red") : "")
    }
    if (!succeeded)
        spinner.fail(formatError(`Couldn't ${action} {${failed}} ${object}s.`))
    else
        spinner.succeed(formatSuccess(`${actioned} {${succeeded}} ${object}s.`)
            + (failed ? formatError(` Couldn't ${action} {${failed}}.`) : ""))
}

module.exports = async function importSubscriptions(reddit, subreddits, users) {
    await subscribe(reddit, subreddits, {
        action: "subscribe to",
        actioning: "Subscribing to",
        actioned: "Subscribed to",
        object: "subreddit"
    })
    await subscribe(reddit, users.map(u => `u_${u}`), {
        action: "follow",
        actioning: "Following",
        actioned: "Followed",
        object: "user"
    })
}