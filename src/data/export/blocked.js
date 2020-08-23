const { spin, formatSuccess } = require("../../util")

module.exports = async function exportBlocked(reddit) {
    const spinner = spin("Retrieving blocked users...")
    const blocked = await reddit.getBlockedUsers()
    spinner.succeed(formatSuccess(`Retrieved {${blocked.length}} blocked users.`))
    return blocked.map(f => f.name)
}