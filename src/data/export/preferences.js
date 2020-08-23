const { spin, formatSuccess } = require("../../util")

module.exports = async function exportPreferences(reddit) {
    const spinner = spin("Retrieving preferences...")
    const preferences = await reddit.getPreferences()
    spinner.succeed(formatSuccess(`Retrieved {${Object.keys(preferences).length}} preferences.`))
    fs.writeFileSync("./pref.json", JSON.stringify(preferences, null, 4))
    return preferences
}