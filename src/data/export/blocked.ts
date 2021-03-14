import Snoowrap from "snoowrap"
import { spin, formatSuccess } from "../../util"

export default async function exportBlocked(reddit: Snoowrap) {
    const spinner = spin("Retrieving blocked users...")
    const blocked = await reddit.getBlockedUsers()
    spinner.succeed(formatSuccess(`Retrieved {${blocked.length}} blocked users.`))
    return blocked.map(user => user.name)
}
