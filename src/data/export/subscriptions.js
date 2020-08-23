const { spin, highlight, success } = require("../../util")

module.exports = async function exportSubscriptions(reddit) {
    const spinner = spin("Retrieving subscriptions...")
    let subscriptions = reddit.getSubscriptions()
    let finished = false
    while (!finished) {
        subscriptions = await subscriptions.fetchMore(({ amount: 100 }))
        spinner.text = highlight(`Retrieving {${subscriptions.length}} subscriptions...`, "yellow")
        finished = subscriptions.isFinished
    }
    subscriptions = Array.from(subscriptions.map(sub => sub.display_name))
    const data = {
        subreddits: subscriptions.filter(sub => !sub.startsWith("u_")),
        users: subscriptions.filter(sub => sub.startsWith("u_")).map(user => user.slice(2))
    }
    spinner.stop()
    success(`Retrieved {${data.subreddits.length}} subreddits.`)
    success(`Retrieved {${data.users.length}} followed users.`)
    return data
}