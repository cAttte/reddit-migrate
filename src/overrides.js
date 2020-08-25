const { error } = require("./util")

module.exports = function override(command) {
    command.missingArgument = () => error(`Missing required argument {${name}}.`)
    command.optionMissingArgument = ({ flags }) => error(`Option {${flags}} argument missing.`)
    command.missingMandatoryOptionValue = ({ flags }) => error(`Required option {${flags}} not specified.`)
    command.unknownOption = (flag) => error(`Unknown option {${flag}}.`)
    command.unknownCommand = () => error(`Unknown command {${command.args[0]}}.`)

    return command
}