const { spin, formatSuccess } = require("../../util")

module.exports = async function exportFriends(reddit) {
    const spinner = spin("Retrieving friends...")
    const friends = await reddit.getFriends().flat()
    spinner.succeed(formatSuccess(`Retrieved {${friends.length}} friends.`))
    return friends.map(f => f.name)
}