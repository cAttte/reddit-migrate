import Snoowrap from "snoowrap"
import { formatSuccess, spin, error } from "../../util"
import Data from "../interfaces/Data"

export default async function importProfile(reddit: Snoowrap, data: Data["profile"]) {
    if (!data || typeof data !== "object" || !Object.entries(data).length)
        return error("No profile settings to update.", false)

    const spinner = spin("Updating profile settings...")
    // @ts-ignore: Snoowrap typings are broken
    const userSubreddit: Snoowrap.Subreddit = await reddit
        .getSubreddit(`u_${reddit.username}`)
        .fetch()
    const oldSettings = await userSubreddit.getSettings()

    await userSubreddit
        // @ts-ignore: missing properties or whatever
        .editSettings(data)
        .then(async () => {
            const newSettings = await userSubreddit.getSettings()
            let updated = 0
            for (const setting of Object.keys(newSettings))
                if (oldSettings[setting] !== newSettings[setting]) updated++
            spinner.succeed(formatSuccess(`Updated {${updated}} profile settings.`))
        })
        .catch(e => spinner.fail(`Couldn't update profile settings: ${e.message}`))
}
