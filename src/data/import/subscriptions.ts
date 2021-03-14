import Snoowrap from "snoowrap"
import { highlight, formatSuccess, formatError, spin, error } from "../../util"
import Data from "../interfaces/Data"

async function subscribe(
    reddit: Snoowrap,
    data: Data["subscriptions"],
    { action, actioning, actioned, type }: Record<string, string>
) {
    if (!data || !Array.isArray(data) || !data.length)
        return error(`No ${type}s to ${action}.`, false)

    const spinner = spin(`${actioning} ${type}s...`)
    let succeeded = 0
    let failed = 0

    for (const name of data) {
        // @ts-ignore: Snoowrap typings are broken
        const sub = await reddit.getSubreddit(name)
        await sub
            .subscribe()
            .then(() => succeeded++)
            .catch(() => failed++)
        // prettier-ignore
        const infoFormatted = highlight(`${actioning} {${succeeded}} ${type}s...`, "yellow")
        const failedFormatted = failed ? highlight(` ({${failed}} failed)`, "red") : ""
        spinner.text = infoFormatted + failedFormatted
    }

    if (!succeeded) {
        spinner.fail(formatError(`Couldn't ${action} {${failed}} ${type}s.`))
    } else {
        const succeededFormatted = formatSuccess(`${actioned} {${succeeded}} ${type}s.`)
        // prettier-ignore
        const failedFormatted = (failed ? formatError(` Couldn't ${action} {${failed}}.`) : "")
        spinner.succeed(succeededFormatted + failedFormatted)
    }
}

export default async function importSubscriptions(
    reddit: Snoowrap,
    subreddits: Data["subscriptions"],
    users: Data["subscriptions"]
) {
    if (subreddits)
        await subscribe(reddit, subreddits, {
            action: "subscribe to",
            actioning: "Subscribing to",
            actioned: "Subscribed to",
            type: "subreddit"
        })
    if (users)
        await subscribe(reddit, users ? users.map(u => `u_${u}`) : users, {
            action: "follow",
            actioning: "Following",
            actioned: "Followed",
            type: "user"
        })
}
