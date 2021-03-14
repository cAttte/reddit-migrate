const { spin, formatSuccess } = require("../../util")

module.exports = async function exportProfile(reddit) {
    const spinner = spin("Retrieving profile settings...")
    //               v remove all proxy-related shit which causes a lot of errors
    const me = JSON.parse(JSON.stringify(await reddit.getMe()))
    spinner.succeed(
        formatSuccess(`Retrieved {${Object.keys(me).length}} profile settings.`)
    )
    return me.subreddit
}
