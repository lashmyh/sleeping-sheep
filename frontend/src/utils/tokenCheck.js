
//check JWT expiration by comparing timestamp to current, expired if true
export function isTokenExpired(token) {
    if (!token) return true; 
    try {
        const decoded = JSON.parse(atob(token.split('.')[1])); 
        const exp = decoded.exp * 1000; 
        return Date.now() >= exp; // Check if the current time is greater than the expiration time
    } catch {
        return true; 
    }
}
