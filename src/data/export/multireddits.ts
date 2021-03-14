import Snoowrap from "snoowrap"
import { spin, formatSuccess } from "../../util"

export default async function exportMultireddits(reddit: Snoowrap) {
    const spinner = spin("Retrieving multireddits...")
    const multireddits = await reddit.getMyMultireddits()
    spinner.succeed(formatSuccess(`Retrieved {${multireddits.length}} multireddits.`))

    const data = multireddits.map(multi => ({
        name: multi.name,
        description: multi.description_md,
        visibility: multi.visibility,
        icon_name: multi.icon_name,
        key_color: multi.key_color,
        weighting_scheme: multi.weighting_schema,
        copied_from: multi.copied_from,
        subreddits: multi.subreddits.map(sub => sub.display_name)
    }))

    return data
}
