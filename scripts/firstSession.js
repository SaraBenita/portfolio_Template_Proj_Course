import CVInfo from "../models/CVInfo.js";
import project from "../models/Project.js";
import { logoutUser, saveCVInfoToUser, getCurrentUser } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        document.body.innerHTML = "<p>User not logged in.</p>";
    }

    const nameSpan = document.getElementById("navDisplayName");
    if (nameSpan)
        nameSpan.textContent = currentUser.displayName;;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn)
        logoutBtn.addEventListener("click", () => {
            logoutUser(); // קריאה לפונקציה הקיימת
            window.location.href = "../pages/loginPage.html"; // הפניה לדף ההתחברות
        });;


    let currentStep = 0;
    let index = 0;
    const steps = document.querySelectorAll(".step");

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });

        document.getElementById("backBtn").style.display = index === 0 ? "none" : "inline-block";
        document.getElementById("nextBtn").style.display = index === steps.length - 1 ? "none" : "inline-block";
        document.getElementById("submitBtn").style.display = index === steps.length - 1 ? "inline-block" : "none";
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    document.getElementById("backBtn").addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    showStep(currentStep); // הצגה התחלתית


    document.getElementById("AddSkill").addEventListener("click", () => {
        index++;

        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.id = `skill${index}`;
        newInput.className = "skill-input";
        newInput.required = true;

        document.getElementById("skillsContainer").appendChild(newInput);
    });

    // הוספת פרויקט
    let projectCounter = 0;


    document.getElementById("handelClickAddProject").addEventListener("click", () => {
        projectCounter++;
        const container = document.getElementById("projectsContainer");
        const div = document.createElement("div");
        div.className = "project";
        div.innerHTML = `
        <label>Project Name: <input type="text" name="projectName" required></label>
        <label>Description: <textarea name="projectDescription" required></textarea></label>
        <label>Project Link: <input type="url" name="projectLink" required></label>
    `;
        container.appendChild(div);
    });

    // שליחת הטופס
    document.getElementById("cvForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const github = document.getElementById("github").value;
        const linkedin = document.getElementById("linkedin").value;
        const about = document.getElementById("about").value;


        const skillInputs = document.querySelectorAll(".skill-input");
        const skills = Array.from(skillInputs)
            .map(input => input.value.trim())
            .filter(val => val !== "");

        const weather = document.getElementById("weather").checked;
        const matach = document.getElementById("matach").checked;

        const projectElements = document.querySelectorAll("#projectsContainer .project");
        const projects = [];

        projectElements.forEach((projEl, index) => {
            const name = projEl.querySelector("input[name='projectName']").value;
            const desc = projEl.querySelector("textarea[name='projectDescription']").value;
            const link = projEl.querySelector("input[name='projectLink']").value;
            projects.push(new project(index + 1, name, desc, link));
        });

        const cv = new CVInfo(email, about, skills, projects, phoneNumber, github, linkedin);
        cv.weather = weather;
        cv.matach = matach;

        console.log("CV Object:", cv);

        const user = getCurrentUser();

        if (!user) {
            alert("User not found. Please log in first.");
            window.location.href = "../pages/registryPage.html";
        } else {
            saveCVInfoToUser(user.email, cv);
            window.location.href = "../pages/homePage.html";
        }
    });

});