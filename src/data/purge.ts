import Snoowrap from "snoowrap"
import { noop, highlight, spin, formatError, formatSuccess, success } from "../util"
import { Submission } from "./Attributes"
import Which from "./Which"

type FetchOptions = { type: Submission; method: "getComments" | "getSubmissions" }
async function fetch(reddit: Snoowrap, { type, method }: FetchOptions) {
    const spinner = spin(`Fetching ${type}s...`)
    let submissions = await reddit.getMe()[method]()
    let finished = false
    while (!finished) {
        const update = `Fetching {${submissions.length.toLocaleString()}} ${type}s...`
        submissions = await submissions.fetchMore({ amount: 100 })
        spinner.text = highlight(update, "yellow")
        finished = submissions.isFinished
    }

    spinner.stop()
    return submissions
}

type DeleteOptions = { type: Submission }
async function _delete(
    submissions: Snoowrap.Listing<Snoowrap.Comment | Snoowrap.Submission>,
    edit: string,
    { type }: DeleteOptions
) {
    if (!submissions.length) return success(`No ${type}s to delete.`)
    const spinner = spin(`Deleting ${type}s...`)

    let succeeded = 0
    let failed = 0
    for (const submission of submissions) {
        const body = { post: "selftext", comment: "body" }[type]
        if (edit && submission[body] !== edit) await submission.edit(edit).catch(noop)

        await submission
            .delete()
            .then(() => succeeded++)
            .catch(() => failed++)

        const infoFormatted = highlight(`Deleting {${succeeded}} ${type}s...`, "yellow")
        const failedFormatted = failed ? highlight(` ({${failed}} failed)`, "red") : ""
        spinner.text = infoFormatted + failedFormatted
    }

    if (!succeeded) {
        spinner.fail(formatError(`Couldn't delete {${failed}} ${type}s.`))
    } else {
        const succeededFormatted = formatSuccess(`Deleted {${succeeded}} ${type}s.`)
        const failedFormatted = failed ? formatError(` Couldn't delete {${failed}}.`) : ""
        spinner.succeed(succeededFormatted + failedFormatted)
    }
}

export default async function purge(reddit: Snoowrap, edit: string, which: Which<true>) {
    if (which.comments) {
        const comments = await fetch(reddit, { type: "comment", method: "getComments" })
        await _delete(comments, edit, { type: "comment" })
    }
    if (which.posts) {
        const posts = await fetch(reddit, { type: "post", method: "getSubmissions" })
        await _delete(posts, edit, { type: "post" })
    }
}
