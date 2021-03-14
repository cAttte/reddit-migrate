import Snoowrap from "snoowrap"
import { spin, highlight, success } from "../../util"
import Which from "../interfaces/Which"

export default async function exportSubscriptions(reddit: Snoowrap, which: Which) {
    const spinner = spin("Retrieving subscriptions...")
    let subscriptions = reddit.getSubscriptions()
    let finished = false

    while (!finished) {
        subscriptions = await subscriptions.fetchMore({ amount: 100 })
        const update = `Retrieving {${subscriptions.length}} subscriptions...`
        spinner.text = highlight(update, "yellow")
        finished = subscriptions.isFinished
    }

    const subNames = Array.from(subscriptions.map(sub => sub.display_name))
    const data = {
        subscriptions: subNames.filter(sub => !sub.startsWith("u_")),
        follows: subNames.filter(sub => sub.startsWith("u_")).map(user => user.slice(2))
    }

    spinner.stop()
    if (which.subscriptions)
        success(`Retrieved {${data.subscriptions.length}} subreddits.`)
    if (which.follows) success(`Retrieved {${data.follows.length}} followed users.`)

    return data
}
