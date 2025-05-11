import {
    getCurrentUser,
    loadUserCVInfo,
    logoutUser,
    getWeatherByCountry,
    getExchangeRates
} from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "../pages/loginPage.html";
        return;
    }

    // Update user information
    document.getElementById("navDisplayName").textContent = currentUser.displayName;
    document.getElementById("userName").textContent = currentUser.displayName;

    // Load CV information
    const cv = loadUserCVInfo(currentUser.email);
    if (cv) {
        // Update about section
        document.getElementById("userTitle").textContent = cv.title || "Full Stack Developer";
        document.getElementById("aboutContent").innerHTML = `<p>${cv.about}</p>`;

        // Update social links
        if (cv.github) document.getElementById("githubLink").href = cv.github;
        if (cv.linkedin) document.getElementById("linkedinLink").href = cv.linkedin;

        // Update skills
        const skillsGrid = document.getElementById("skillsGrid");
        skillsGrid.innerHTML = cv.skills.map(skill => `
            <div class="skill-item">${skill}</div>
        `).join("");

        // Update projects
        const projectsGrid = document.getElementById("projectsGrid");
        projectsGrid.innerHTML = cv.projects.map(project => `
    <div class="project-card">
        <div class="project-content">
            <h3>${project.projectName}</h3>
            <p>${project.projectDescription}</p>
            <a href="${project.projectLink}" target="_blank">
                View Project <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </div>
`).join("");

        // Initialize weather widget if enabled
        if (cv.weather) {
            const weatherSection = document.getElementById("weatherSection");
            weatherSection.style.display = "block";

            const countrySelect = document.getElementById("countrySelect");
            countrySelect.addEventListener("change", updateWeather);
            await updateWeather();
        }

        // Initialize currency exchange if enabled
        if (cv.matach) {
            const matachSection = document.getElementById("matachSection");
            matachSection.style.display = "block";

            const convertBtn = document.getElementById("convertBtn");
            convertBtn.addEventListener("click", updateExchange);
            await updateExchange();
        }


        // Update footer social links with error handling
        try {
            // Update LinkedIn
            const linkedinLink = document.querySelector('.footer-social a[href*="linkedin"]');
            if (linkedinLink && cv.linkedin) {
                linkedinLink.href = cv.linkedin;
            }

            // Update GitHub
            const githubLink = document.querySelector('.footer-social a[href*="github"]');
            if (githubLink && cv.github) {
                githubLink.href = cv.github;
            }

            // Update Email
            const emailLink = document.querySelector('.footer-social a[href*="mailto"]');
            if (emailLink && cv.email) {
                emailLink.href = `mailto:${cv.email}`;
            }

            // Update Phone
            const phoneLink = document.querySelector('.footer-social a[href*="tel"]');
            if (phoneLink && cv.phoneNumber) {
                phoneLink.href = `tel:${cv.phoneNumber}`;
            }
        } catch (error) {
            console.error("Error updating footer links:", error);
        }
    }

    // Event Listeners
    document.getElementById("logoutBtn").addEventListener("click", () => {
        logoutUser();
        window.location.href = "../pages/loginPage.html";
    });

    // Helper Functions
    async function updateWeather() {
        const selectedCountry = document.getElementById("countrySelect").value;
        try {
            const weather = await getWeatherByCountry(selectedCountry);
            if (weather) {
                document.getElementById("weather-city").textContent = weather.city;
                document.getElementById("weather-temp").textContent = weather.temperature;
                document.getElementById("weather-desc").textContent = weather.description;
                document.getElementById("weather-feels").textContent = weather.feelsLike;
                document.getElementById("weather-humidity").textContent = weather.humidity;
            }
        } catch (err) {
            console.warn("Failed to load weather:", err);
        }
    }

    async function updateExchange() {
        const fromSelect = document.getElementById("fromCurrency");
        const toSelect = document.getElementById("toCurrency");
        const from = fromSelect.value;
        const to = toSelect.value;

        try {
            const data = await getExchangeRates(from, to);
            document.getElementById("exchange-rate").textContent = data.rate.toFixed(4);
            document.getElementById("exchange-date").textContent = new Date().toLocaleString();
        } catch (err) {
            console.warn("Failed to load exchange rates:", err);
        }
    }
});
