const importSubscriptions = require("./import/subscriptions")
const importFriends = require("./import/friends")
const importBlocked = require("./import/blocked")
const importMultireddits = require("./import/multireddits")
const importProfile = require("./import/profile")
const importPreferences = require("./import/preferences")

module.exports = async function importData(reddit, data, which) {
    if (which.subscriptions || which.follows) await importSubscriptions(reddit,
        which.subscriptions ? data.subscriptions : null,
        which.follows ? data.follows : null
    )
    if (which.friends) await importFriends(reddit, data.friends)
    if (which.blocked) await importBlocked(reddit, data.blocked)
    if (which.multireddits) await importMultireddits(reddit, data.multireddits)
    if (which.profile) await importProfile(reddit, data.profile)
    if (which.preferences) await importPreferences(reddit, data.preferences)
}