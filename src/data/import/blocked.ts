import Snoowrap, { RedditUser } from "snoowrap"
import { highlight, formatSuccess, formatError, spin, error } from "../../util"
import Data from "../interfaces/Data"

// Snoowrap doesn't support the block_user endpoint :)
function block(user: RedditUser) {
    // @ts-ignore: _post() is private
    return user._post({ uri: "api/block_user", form: { name: user.name } })
}

export default async function importBlocked(reddit: Snoowrap, data: Data["blocked"]) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No users to block.", false)
    const spinner = spin("Blocking users...")
    let succeeded = 0
    let failed = 0

    for (const username of data) {
        // @ts-ignore: Snoowrap typings are broken
        const user: RedditUser = await reddit.getUser(username)
        await block(user)
            .then(() => succeeded++)
            .catch(() => failed++)

        const infoFormatted = highlight(`Blocking {${succeeded}} users...`, "yellow")
        const failedFormatted = failed ? highlight(` ({${failed}} failed)`, "red") : ""
        spinner.text = infoFormatted + failedFormatted
    }

    if (!succeeded) {
        spinner.fail(formatError(`Couldn't block {${failed}} users.`))
    } else {
        const succeededFormatted = formatSuccess(`Blocked {${succeeded}} users.`)
        const failedFormatted = failed ? formatError(` Couldn't block {${failed}}.`) : ""
        spinner.succeed(succeededFormatted + failedFormatted)
    }
}
