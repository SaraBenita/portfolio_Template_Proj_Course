import User from "../models/User.js";
import { loadUsers } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registrationForm");

    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const displayName = document.getElementById("displayName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Retrieve existing users from Local Storage
        const users = loadUsers();

        // Check if the email already exists
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert("A user with this email already exists. Please log in.");
            return;
        }

        // Generate a new userId (incremental index)
        const userId = users.length > 0 ? users[users.length - 1].userId + 1 : 1;

        // Create a new user
        const newUser = new User(userId, email, password, displayName);

        // Add the new user to the users array
        users.push(newUser);

        // Save the updated users array to Local Storage
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        window.location.href = "firstSession.html";
    });
});