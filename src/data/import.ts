import Snoowrap from "snoowrap"
import importSubscriptions from "./import/subscriptions"
import importFriends from "./import/friends"
import importBlocked from "./import/blocked"
import importMultireddits from "./import/multireddits"
import importProfile from "./import/profile"
import importPreferences from "./import/preferences"
import Data from "./interfaces/Data"
import Which from "./interfaces/Which"

export default async function importData(reddit: Snoowrap, data: Data, which: Which) {
    if (which.subscriptions || which.follows)
        await importSubscriptions(
            reddit,
            which.subscriptions ? data.subscriptions : null,
            which.follows ? data.follows : null
        )

    if (which.friends) await importFriends(reddit, data.friends)
    if (which.blocked) await importBlocked(reddit, data.blocked)
    if (which.multireddits) await importMultireddits(reddit, data.multireddits)
    if (which.profile) await importProfile(reddit, data.profile)
    if (which.preferences) await importPreferences(reddit, data.preferences)
}
