// https://github.com/partkeepr/PartKeepr/blob/master/src/PartKeepr/FrontendBundle/Resources/public/js/Components/Auth/WSSEAuthenticationProvider.js
var CryptoJS = require('crypto-js');

/**
 * Generates the nonce
 *
 * @param {Integer} length The length of the nonce
 * @return {String} The generated nonce
 */
function generateNonce(length) {
    var nonceChars = '0123456789abcdef';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += nonceChars.charAt(Math.floor(Math.random() * nonceChars.length));
    }
    return result;
}

/**
 * Returns a W3C-Compliant date
 *
 * @param {Object} date The DateTime object to convert
 * @return {String} The W3C-compliant date
 */
function getW3CDate(date) {
    var yyyy = date.getUTCFullYear();
    var mm = (date.getUTCMonth() + 1);
    if (mm < 10) {
        mm = '0' + mm;
    }
    var dd = (date.getUTCDate());
    if (dd < 10) {
        dd = '0' + dd;
    }
    var hh = (date.getUTCHours());
    if (hh < 10) {
        hh = '0' + hh;
    }
    var mn = (date.getUTCMinutes());
    if (mn < 10) {
        mn = '0' + mn;
    }
    var ss = (date.getUTCSeconds());
    if (ss < 10) {
        ss = '0' + ss;
    }
    return yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + mn + ':' + ss + 'Z';
}

/**
 * Merges the password and salt
 *
 * @param {String} raw The raw password
 * @param {String} salt The salt
 */
function mergePasswordAndSalt(raw, salt) {
    return raw + '{' + salt + '}';
}

/**
 * Encodes the password with the salt and a specific number of iterations
 *
 * @param {String} raw The raw password
 * @param {String} salt The salt
 * @param {Integer} iterations The number of iterations
 */
function encodePassword(raw, salt, iterations) {
    var salted = mergePasswordAndSalt(raw, salt);

    var digest = CryptoJS.SHA512(salted);

    for (var i = 1; i < digest; i++) {
        digest = CryptoJS.SHA512(digest + salted);
    }

    return CryptoJS.enc.Base64.stringify(digest);
}

/**
 * Generates the WSSE Secret
 */
function generateSecret(password, salt) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.SHA512(password + '{' + salt + '}'));
}

/**
 * Returns the WSSE string for authentication
 *
 * @return {String}
 */
export function getWSSE(username, password, salt, creationDate = null, nonceLength = 16) {
    var nonce = generateNonce(nonceLength);
    var nonce64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(nonce));
    var created = null;
    if (creationDate == null) {
        created = getW3CDate(new Date());
    } else {
        created = getW3CDate(creationDate);
    }

    var digest = encodePassword(nonce + created + generateSecret(password, salt), salt, 1);
    return 'UsernameToken Username="'
        + username + '", PasswordDigest="'
        + digest + '", Nonce="'
        + nonce64 + '", Created="'
        + created + '"';
}
