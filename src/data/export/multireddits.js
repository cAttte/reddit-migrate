const { spin, formatSuccess } = require("../../util")

module.exports = async function exportMultireddits(reddit) {
    const spinner = spin("Retrieving multireddits...")
    const multireddits = await reddit.getMyMultireddits()
    spinner.succeed(formatSuccess(`Retrieved {${multireddits.length}} multireddits.`))
    const data = multireddits.map(multi => ({
        name: multi.name,
        description: multi.description_md,
        over_18: multi.over_18,
        visibility: multi.visibility,
        key_color: multi.key_color,
        copied_from: multi.copied_from,
        subreddits: multi.subreddits.map(sub => sub.display_name)
    }))
    return data
}
