const { formatSuccess, spin } = require("../../util")

module.exports = async function importProfile(reddit, data) {
    if (!data || typeof data !== "object" || !Object.entries(data).length)
        return error("No profile settings to update.", false)

    const spinner = spin("Updating profile settings...")
    const userSubreddit = await reddit.getSubreddit(`u_${reddit.username}`).fetch()
    const oldSettings = await userSubreddit.getSettings()

    await userSubreddit.editSettings(data)
        .then(async () => {
            const newSettings = await userSubreddit.getSettings()
            let updated = 0
            for (setting of Object.keys(newSettings))
                if (oldSettings[setting] !== newSettings[setting])
                    updated++
            spinner.succeed(formatSuccess(`Updated {${updated}} profile settings.`))
        })
        .catch(e => {
            spinner.fail(`Couldn't update profile settings: ${e.message}`)
        })
}