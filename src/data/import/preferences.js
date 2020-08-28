const { formatSuccess, spin, error } = require("../../util")

module.exports = async function importPreferences(reddit, data) {
    if (!data || typeof data !== "object" || !Object.entries(data).length)
        return error("No preferences to update.", false)

    const spinner = spin("Updating preferences...")
    const oldPreferences = await reddit.getPreferences()

    await reddit.updatePreferences(data)
        .then(async () => {
            const newPreferences = await reddit.getPreferences()
            let updated = 0
            for (pref of Object.keys(newPreferences))
                if (oldPreferences[pref] !== newPreferences[pref])
                    updated++
            spinner.succeed(formatSuccess(`Updated {${updated}} preferences.`))
        })
        .catch(e => {
            spinner.fail(`Couldn't update preferences: ${e.message}`)
        })
}