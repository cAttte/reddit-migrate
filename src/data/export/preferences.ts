import Snoowrap from "snoowrap"
import { spin, formatSuccess } from "../../util"

export default async function exportPreferences(reddit: Snoowrap) {
    const spinner = spin("Retrieving preferences...")
    const preferences = await reddit.getPreferences()
    spinner.succeed(
        formatSuccess(`Retrieved {${Object.keys(preferences).length}} preferences.`)
    )

    return preferences
}
