const { noop, highlight, spin, formatError, formatSuccess, success } = require("../util")

async function fetch(reddit, { object, method }) {
    const spinner = spin(`Fetching ${object}s...`)
    let submissions = await reddit.getMe()[method]()
    let finished = false
    while (!finished) {
        submissions = await submissions.fetchMore(({ amount: 100 }))
        spinner.text = highlight(`Fetching {${submissions.length.toLocaleString()}} ${object}s...`, "yellow")
        finished = submissions.isFinished
    }
    spinner.stop()
    return submissions
}

async function _delete(submissions, edit, { object }) {
    if (!submissions.length) return success(`No ${object}s to delete.`)
    const spinner = spin(`Deleting ${object}s...`)
    let succeeded = 0
    let failed = 0
    for (submission of submissions) {
        if (edit && submission.body !== edit) await submission.edit(edit).catch(noop)
        await submission.delete()
            .then(() => succeeded++)
            .catch(() => failed++)
        spinner.text = highlight(`Deleting {${succeeded}} ${object}s...`, "yellow")
            + (failed ? highlight(` ({${failed}} failed)`, "red") : "")
    }
    if (!succeeded)
        spinner.fail(formatError(`Couldn't delete {${failed}} ${object}s.`))
    else
        spinner.succeed(formatSuccess(`Deleted {${succeeded}} ${object}s.`)
            + (failed ? formatError(` Couldn't delete {${failed}}.`) : ""))
}

module.exports = async function purge(reddit, edit, which) {
    if (which.comments) {
        const comments = await fetch(reddit, { object: "comment", method: "getComments" })
        await _delete(comments, edit, { object: "comment" })
    }
    if (which.posts) {
        const posts = await fetch(reddit, { object: "post", method: "getSubmissions" })
        await _delete(posts, edit, { object: "post" })
    }
}