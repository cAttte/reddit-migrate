import Snoowrap from "snoowrap"
import { formatSuccess, spin, error } from "../../util"
import Data from "../interfaces/Data"

export default async function importPreferences(
    reddit: Snoowrap,
    data: Data["preferences"]
) {
    if (!data || typeof data !== "object" || !Object.entries(data).length)
        return error("No preferences to update.", false)

    const spinner = spin("Updating preferences...")
    const oldPreferences = await reddit.getPreferences()

    await reddit
        .updatePreferences(data)
        .then(async () => {
            const newPreferences = await reddit.getPreferences()
            let updated = 0
            for (const pref of Object.keys(newPreferences))
                if (oldPreferences[pref] !== newPreferences[pref]) updated++
            spinner.succeed(formatSuccess(`Updated {${updated}} preferences.`))
        })
        .catch(e => spinner.fail(`Couldn't update preferences: ${e.message}`))
}
