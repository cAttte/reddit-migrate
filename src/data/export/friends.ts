import Snoowrap from "snoowrap"
import { spin, formatSuccess } from "../../util"

export default async function exportFriends(reddit: Snoowrap) {
    const spinner = spin("Retrieving friends...")
    const friends = (await reddit.getFriends()).flat()
    spinner.succeed(formatSuccess(`Retrieved {${friends.length}} friends.`))
    return friends.map(user => user.name)
}
