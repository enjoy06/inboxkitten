/**
 * Validates an email username according to standard email conventions
 * 
 * @param username The username portion of an email address to validate
 * @returns The validated username
 * @throws Error with specific validation failure message
 */
export function validateUsername(username: string): string {
    // Trim leading and trailing whitespaces
    username = username.trim();

    // Check if the sanitized string is empty
    if (username.length === 0) {
        throw new Error("Username cannot be empty");
    }

    // Check for disallowed characters
    // Allowed characters: alphanumeric, dot (.), underscore (_), hyphen (-), plus (+)
    const disallowedChars = /[^a-zA-Z0-9._+-]/g;
    if (disallowedChars.test(username)) {
        throw new Error("Username contains invalid characters. Only letters, numbers, and the symbols ., _, +, - are allowed");
    }

    // Ensure that the username contains at least one alphanumeric character
    if (!/[a-zA-Z0-9]/.test(username)) {
        throw new Error("Username must contain at least one letter or number");
    }

    // Check for consecutive dots
    if (/\.{2,}/.test(username)) {
        throw new Error("Username cannot contain consecutive dots (..)");
    }

    // Ensure that the username starts and ends with an alphanumeric character
    if (/^[._+-]/.test(username)) {
        throw new Error("Username must start with a letter or number");
    }
    
    if (/[._+-]$/.test(username)) {
        throw new Error("Username must end with a letter or number");
    }

    return username;
}
