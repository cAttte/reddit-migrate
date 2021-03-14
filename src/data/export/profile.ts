import Snoowrap from "snoowrap"
import { spin, formatSuccess } from "../../util"

// @ts-ignore: Snoowrap typings are broken
export default async function exportProfile(
    reddit: Snoowrap
): Promise<Snoowrap.Subreddit> {
    const spinner = spin("Retrieving profile settings...")
    // JSON to remove all proxy-related shit which causes a lot of errors
    // @ts-ignore: Snoowrap typings are broken
    const me = JSON.parse(JSON.stringify(await reddit.getMe()))
    spinner.succeed(
        formatSuccess(`Retrieved {${Object.keys(me).length}} profile settings.`)
    )

    return me.subreddit
}
