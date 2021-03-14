import Snoowrap from "snoowrap"
import exportSubscriptions from "./export/subscriptions"
import exportFriends from "./export/friends"
import exportBlocked from "./export/blocked"
import exportMultireddits from "./export/multireddits"
import exportProfile from "./export/profile"
import exportPreferences from "./export/preferences"
import Data from "./interfaces/Data"
import Which from "./interfaces/Which"

export default async function exportData(reddit: Snoowrap, which: Which) {
    const data: Partial<Data> = { exported_at: null }
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
