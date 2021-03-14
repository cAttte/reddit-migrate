import stripANSI from "strip-ansi"
import logSymbols from "log-symbols"
import chalk from "chalk"
import ora from "ora"

let spinner: ora.Ora = null

export const noop = () => null

// colors
export const orange = chalk.rgb(255, 69, 0)
export const orangeString = "rgb(255,69,0)"
export const bgOrange = chalk.bgRgb(255, 69, 0)
export const bgOrangeString = "bgRgb(255,69,0)"
export const blue = chalk.rgb(113, 147, 255)
export const blueString = "rgb(113,147,255)"

// symbols
const info = blue(stripANSI(logSymbols.info))
export const symbols = { ...logSymbols, info }

// logging
export function highlight(string: string, color: string) {
    return string.replace(/{(.+?)}/g, (_, $1) => chalk[color + "Bright"]($1))
}

export const formatSuccess = (message: string) => highlight(message, "green")
export const formatWarning = (message: string) => highlight(message, "yellow")
export const formatError = (message: string) => highlight(message, "red")

export const success = (message: string) =>
    console.log(`${symbols.success} ${formatSuccess(message)}`)
export const warning = (message: string) =>
    console.log(`${symbols.warning} ${formatWarning(message)}`)
export function error(message: string, exit: boolean = true) {
    if (spinner) spinner.stop()
    console.log(`${symbols.error} ${formatError(message)}`)
    if (exit) process.exit(1)
}

export function spin(message: string, options: ora.Options = {}) {
    if (spinner) spinner.stop()
    spinner = ora({
        text: highlight(message, "yellow"),
        spinner: "line",
        color: "yellow",
        ...options
    })

    return spinner.start()
}
