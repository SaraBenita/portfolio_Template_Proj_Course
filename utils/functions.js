

export function loadUsers() {

    return JSON.parse(localStorage.getItem("users") || []);
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser") || null);
}

export function logoutUser() {
    localStorage.removeItem("currentUser"); // Clear user data from localStorage
    document.location.href = "homePage.html"; // Redirect to registration page
}


export function saveCVInfoToUser(email, CVInfo) {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        console.warn(`User with email ${email} not found.`);
        return false;
    }

    users[userIndex].cv = CVInfo;
    console.log(users[userIndex]);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
    return true;
}