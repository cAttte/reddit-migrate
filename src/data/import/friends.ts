import Snoowrap, { RedditUser } from "snoowrap"
import { highlight, formatSuccess, formatError, spin, error } from "../../util"
import Data from "../interfaces/Data"

export default async function importFriends(reddit: Snoowrap, data: Data["friends"]) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No users to friend.", false)

    const spinner = spin("Friending users...")
    let succeeded = 0
    let failed = 0

    for (const username of data) {
        // @ts-ignore: Snoowrap typings are broken
        const user: RedditUser = await reddit.getUser(username)
        await user
            .friend(null)
            .then(() => succeeded++)
            .catch(() => failed++)

        const infoFormatted = highlight(`Friending {${succeeded}} users...`, "yellow")
        const failedFormatted = failed ? highlight(` ({${failed}} failed)`, "red") : ""
        spinner.text = infoFormatted + failedFormatted
    }

    if (!succeeded) {
        spinner.fail(formatError(`Couldn't friend {${failed}} users.`))
    } else {
        const succeededFormatted = formatSuccess(`Friended {${succeeded}} users.`)
        const failedFormatted = failed ? formatError(` Couldn't friend {${failed}}.`) : ""
        spinner.succeed(succeededFormatted + failedFormatted)
    }
}
