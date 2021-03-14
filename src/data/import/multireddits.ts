import Snoowrap, { MultiReddit } from "snoowrap"
import { highlight, formatSuccess, formatError, spin, error } from "../../util"
import { Multireddit } from "../interfaces/Data"

async function copyMultireddit(reddit: Snoowrap, data: Multireddit) {
    let copied: MultiReddit = null

    if (data.copied_from) {
        const [username, multiname] = data.copied_from
            .match(/user\/([^/]+)\/m\/([^/]+)/)
            .slice(1)
        if (!username || !multiname) throw new Error()

        // @ts-ignore: Snoowrap typings are broken
        const multi = await reddit.getUser(username).getMultireddit(multiname)
        copied = await multi.copy({ newName: data.name })

        for (const sub of data.subreddits)
            if (!copied.subreddits.map(s => s.display_name).includes(sub))
                // @ts-ignore: Snoowrap typings are broken
                await copied.addSubreddit(sub)
        for (const sub of copied.subreddits.map(s => s.display_name))
            if (!data.subreddits.includes(sub))
                // @ts-ignore: Snoowrap typings are broken
                await copied.removeSubreddit(sub)
    } else {
        // @ts-ignore: Snoowrap typings are broken
        copied = await reddit.createMultireddit({
            subreddits: data.subreddits,
            name: data.name
        })
    }

    if (!copied) throw new Error()

    // only 'subreddits' and 'name' can be provided when creating
    // @ts-ignore: Snoowrap typings are broken
    return await copied.edit({
        description: data.description,
        visibility: data.visibility,
        icon_name: data.icon_name,
        key_color: data.key_color,
        weighting_scheme: data.weighting_scheme
    })
}

export default async function importMultireddits(reddit: Snoowrap, data: Multireddit[]) {
    if (!data || !Array.isArray(data) || !data.length)
        return error("No multireddits to copy.", false)

    const spinner = spin("Copying multireddits...")
    let succeeded = 0
    let failed = 0

    for (const multireddit of data) {
        await copyMultireddit(reddit, multireddit)
            .then(() => succeeded++)
            .catch(() => failed++)
        // prettier-ignore
        const infoFormatted = highlight(`Copying {${succeeded}} multireddits...`, "yellow")
        const failedFormatted = failed ? highlight(` ({${failed}} failed)`, "red") : ""
        spinner.text = infoFormatted + failedFormatted
    }

    if (!succeeded) {
        spinner.fail(formatError(`Couldn't copy {${failed}} multireddits.`))
    } else {
        const succeededFormatted = formatSuccess(`Copied {${succeeded}} multireddits.`)
        const failedFormatted = failed ? formatError(` Couldn't copy {${failed}}.`) : ""
        spinner.succeed(succeededFormatted + failedFormatted)
    }
}
