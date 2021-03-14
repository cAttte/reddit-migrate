import RedditMigrate from "../RedditMigrate"
import loadCredentials from "../credentials/load"
import login from "../login"
import exportData from "../data/export"
import importData from "../data/import"
import Which from "../data/interfaces/Which"

export default async function migrateCommand(self: RedditMigrate) {
    const credentials = await loadCredentials(self, true)
    const oldReddit = await login(credentials, "OLD_")
    const data = await exportData(oldReddit, self.which as Which<false>)
    const newReddit = await login(credentials, "NEW_")
    await importData(newReddit, data, self.which as Which<false>)
}
