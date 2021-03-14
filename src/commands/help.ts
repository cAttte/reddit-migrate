import RedditMigrate from "../RedditMigrate"
import chalk from "chalk"
import { error, blue, blueString } from "../util"

export default function helpCommand(this: RedditMigrate, commandName: string) {
    if (
        typeof commandName !== "string" ||
        !commandName ||
        commandName.toLowerCase() === "help"
    ) {
        console.log(chalk`
{bold Usage:}
    reddit-migrate {${blueString} [command] [options]}

{bold Commands:}
    ${this.commands
        .map(
            command =>
                `${command._name} [options]`.padEnd(20) + blue(command._description)
        )
        .join("\n" + " ".repeat(4))}`)
    } else {
        const command = this.commands.find(c => c._name === commandName.toLowerCase())
        if (!command) error(`Unknown command {${commandName}}.`)

        console.log(chalk`
${command._description}

{bold Usage:}
    ${command._name} {${blueString} [options]}

{bold Options:}
    ${command.options
        .map((option: any) => `${option.flags}`.padEnd(24) + blue(option.description))
        .join("\n" + " ".repeat(4))}`)
    }
}
