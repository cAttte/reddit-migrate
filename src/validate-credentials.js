module.exports = function(name, input) {
    if (name.endsWith("USERNAME"))
        if (input.length < 3 || input.length > 20)
            return "Username must be between 3 and 20 characters."
        else
            return true
    else if (name.endsWith("PASSWORD"))
        if (input.length < 6)
            return "Password must be at least 6 characters long."
        else
            return true
}