const loadCredentials = require("../credentials/load")
const login = require("../login")
const exportData = require("../data/export")
const importData = require("../data/import")

module.exports = async function exportCommand(self) {
    const credentials = await loadCredentials(this, true)
    const oldReddit = await login(credentials, "OLD_")
    const data = await exportData(oldReddit)
    const newReddit = await login(credentials, "NEW_")
    await importData(newReddit, data)
}