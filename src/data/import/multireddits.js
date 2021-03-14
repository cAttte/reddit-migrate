const { highlight, formatSuccess, formatError, spin, error } = require("../../util")

async function copyMultireddit(reddit, data) {
    let copied = null
    if (data.copied_from) {
        const [username, multiname] = data.copied_from
            .match(/user\/([^/]+)\/m\/([^/]+)/)
            .slice(1)
        if (!username || !multiname) throw new Error()
        const multi = await reddit.getUser(username).getMultireddit(multiname)
        copied = await multi.copy({ newName: data.name })
        for (sub of data.subreddits)
            if (!copied.subreddits.map(s => s.display_name).includes(sub))
                await copied.addSubreddit(sub)
        for (sub of copied.subreddits.map(s => s.display_name))
            if (!data.subreddits.includes(sub)) await copied.removeSubreddit(sub)
    } else {
        copied = await reddit.createMultireddit({
            subreddits: data.subreddits,
            name: data.name
        })
    }

    if (!copied) throw new Error()
    return await copied.edit({
        description: data.description,
        visibility: data.visibility,
        icon_name: data.icon_name,
        key_color: data.key_color,
        weighting_scheme: data.weighting_scheme
    })
}

module.exports = async function importMultireddits(reddit, data) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No multireddits to copy.", false)

    const spinner = spin("Copying multireddits...")
    let succeeded = 0
    let failed = 0
    for (multireddit of data) {
        await copyMultireddit(reddit, multireddit)
            .then(() => succeeded++)
            .catch(() => failed++)
        spinner.text =
            highlight(`Copying {${succeeded}} multireddits...`, "yellow") +
            (failed ? highlight(` ({${failed}} failed)`, "red") : "")
    }
    if (!succeeded) spinner.fail(formatError(`Couldn't copy {${failed}} multireddits.`))
    else
        spinner.succeed(
            formatSuccess(`Copied {${succeeded}} multireddits.`) +
                (failed ? formatError(` Couldn't copy {${failed}}.`) : "")
        )
}
