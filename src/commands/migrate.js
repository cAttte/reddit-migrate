const loadCredentials = require("../credentials/load")
const login = require("../login")
const exportData = require("../data/export")
const importData = require("../data/import")

module.exports = async function migrateCommand(self) {
    const credentials = await loadCredentials(self, true)
    const oldReddit = await login(credentials, "OLD_")
    const data = await exportData(oldReddit, self.which)
    const newReddit = await login(credentials, "NEW_")
    await importData(newReddit, data, self.which)
}
