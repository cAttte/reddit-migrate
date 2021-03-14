const { spin, highlight, success } = require("../../util")

module.exports = async function exportSubscriptions(reddit, which) {
    const spinner = spin("Retrieving subscriptions...")
    let subscriptions = reddit.getSubscriptions()
    let finished = false
    while (!finished) {
        subscriptions = await subscriptions.fetchMore({ amount: 100 })
        spinner.text = highlight(
            `Retrieving {${subscriptions.length}} subscriptions...`,
            "yellow"
        )
        finished = subscriptions.isFinished
    }
    subscriptions = Array.from(subscriptions.map(sub => sub.display_name))
    const data = {
        subscriptions: subscriptions.filter(sub => !sub.startsWith("u_")),
        follows: subscriptions
            .filter(sub => sub.startsWith("u_"))
            .map(user => user.slice(2))
    }
    spinner.stop()
    if (which.subscriptions)
        success(`Retrieved {${data.subscriptions.length}} subreddits.`)
    if (which.follows) success(`Retrieved {${data.follows.length}} followed users.`)
    return data
}
