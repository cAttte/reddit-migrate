const importSubscriptions = require("./import/subscriptions")
const importFriends = require("./import/friends")
const importBlocked = require("./import/blocked")
const importMultireddits = require("./import/multireddits")
const importProfile = require("./import/profile")
const importPreferences = require("./import/preferences")

module.exports = async function importData(reddit, data) {
    await importSubscriptions(reddit, data.subscriptions, data.follows)
    await importFriends(reddit, data.friends)
    await importBlocked(reddit, data.blocked)
    await importMultireddits(reddit, data.multireddits)
    await importProfile(reddit, data.profile)
    await importPreferences(reddit, data.preferences)
}