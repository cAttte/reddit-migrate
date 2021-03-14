import loadCredentials from "../credentials/load"
import login from "../login"
import purge from "../data/purge"
import RedditMigrate from "../RedditMigrate"
import Which from "../data/interfaces/Which"

export default async function purgeCommand(self: RedditMigrate) {
    const credentials = await loadCredentials(self, false)
    const reddit = await login(credentials)
    await purge(reddit, self.edit, self.which as Which<true>)
}
