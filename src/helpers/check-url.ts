/**
 * Checks if a given string is a valid URL.
 *
 * @param {string} urlToCheck - The URL string to check.
 * @returns {URL|boolean} - Returns a valid URL object if the input is a valid URL, or false if it's not a valid URL.
 */
export default function checkUrl(urlToCheck: string) {
  try {
    // Attempt to create a URL object from the input string
    return new URL(urlToCheck);
  } catch {
    // If an exception is thrown, the input is not a valid URL
    return false;
  }
}
