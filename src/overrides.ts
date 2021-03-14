import commander from "commander"
import { error } from "./util"

/**
 * Override some of Commander's default methods to stick to the CLI's logging style.
 */
export default function override(command: commander.Command): void {
    command.missingArgument = (name: string) =>
        error(`Missing required argument {${name}}.`)
    command.optionMissingArgument = ({ flags }) =>
        error(`Option {${flags}} argument missing.`)
    command.missingMandatoryOptionValue = ({ flags }) =>
        error(`Required option {${flags}} not specified.`)
    command.unknownOption = (flag: string) => error(`Unknown option {${flag}}.`)
    command.unknownCommand = () => error(`Unknown command {${command.args[0]}}.`)

    // this is the only way i thought of to "remove" the help option...
    command.helpOption(`--${Math.random()}`, "")
}
