const loadCredentials = require("../credentials/load")
const login = require("../login")
const purge = require("../data/purge")

module.exports = async function purgeCommand(self) {
    const credentials = await loadCredentials(self, false)
    const reddit = await login(credentials)
    await purge(reddit, self.edit, self.which)
}
