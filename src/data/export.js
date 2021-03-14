const exportSubscriptions = require("./export/subscriptions")
const exportFriends = require("./export/friends")
const exportBlocked = require("./export/blocked")
const exportMultireddits = require("./export/multireddits")
const exportProfile = require("./export/profile")
const exportPreferences = require("./export/preferences")

module.exports = async function exportData(reddit, which) {
    const data = { exported_at: null }
    if (which.subscriptions || which.follows) {
        const { subscriptions, follows } = await exportSubscriptions(reddit, which)
        if (which.subscriptions) data.subscriptions = subscriptions
        if (which.follows) data.follows = follows
    }
    if (which.friends) data.friends = await exportFriends(reddit)
    if (which.blocked) data.blocked = await exportBlocked(reddit)
    if (which.multireddits) data.multireddits = await exportMultireddits(reddit)
    if (which.profile) data.profile = await exportProfile(reddit)
    if (which.preferences) data.preferences = await exportPreferences(reddit)
    data.exported_at = new Date().toISOString()
    console.log()
    return data
}
