export default function validateCredentials(
    name: string,
    input: string,
    oldInput: string
): true | string {
    if (name.endsWith("USERNAME")) {
        if (input.length < 3 || input.length > 20)
            return "Username must be between 3 and 20 characters."
        else if (name === "NEW_USERNAME" && oldInput === input)
            return "New username can't be the same as old one."
        else return true
    } else if (name.endsWith("PASSWORD")) {
        if (input.length < 6) return "Password must be at least 6 characters long."
        else return true
    } else if (name.endsWith("CLIENT_ID") || name.endsWith("CLIENT_SECRET")) {
        return true
    }
}
