const fs = require("fs")
const exportSubscriptions = require("./export/subscriptions")
const exportFriends = require("./export/friends")
const exportBlocked = require("./export/blocked")
const exportMultireddits = require("./export/multireddits")
const exportProfile = require("./export/profile")
const exportPreferences = require("./export/preferences")

module.exports = async function exportData(reddit) {
    const data = {
        ...await exportSubscriptions(reddit), // { subreddits, users }
        friends: await exportFriends(reddit),
        blocked: await exportBlocked(reddit),
        multireddits: await exportMultireddits(reddit),
        profile: await exportProfile(reddit),
        preferences: await exportPreferences(reddit)
    }
    return data
}