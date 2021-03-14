// @ts-ignore
import pkg = require("../package.json")
import { formatSuccess, error, spin } from "./util"
import { Credentials } from "./credentials/Credentials"
import Snoowrap from "snoowrap"

export async function login(credentials: Credentials, prefix: "OLD_" | "NEW_" | "" = "") {
    const username = credentials[prefix + "USERNAME"]
    const spinner = spin(`Attempting to login as {${username}}...`)

    const reddit = new Snoowrap({
        userAgent: `reddit-migrate@${pkg.version} | github.com/cAttte/reddit-migrate`,
        clientId: credentials[prefix + "CLIENT_ID"],
        clientSecret: credentials[prefix + "CLIENT_SECRET"],
        username: credentials[prefix + "USERNAME"],
        password: credentials[prefix + "PASSWORD"]
    })

    // @ts-ignore: Snoowrap typings are broken
    await reddit.getMe().catch(() => error(`Couldn't log in as {${username}}.`))
    spinner.succeed(formatSuccess(`Successfully logged in as {${username}}.`))

    return reddit
}
