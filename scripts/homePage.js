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
        document.body.innerHTML = "<p>User not logged in.</p>";
        return;
    }

    const nameSpan = document.getElementById("navDisplayName");
    const logoutBtn = document.getElementById("logoutBtn");
    if (nameSpan) nameSpan.textContent = currentUser.displayName;;
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
        logoutUser(); // קריאה לפונקציה הקיימת
        window.location.href = "../pages/loginPage.html"; // הפניה לדף ההתחברות
    });;

    const cv = loadUserCVInfo(currentUser.email);
    const cvSection = document.getElementById("cvSection");

    if (!cv) {
        cvSection.innerHTML = `
      <p>No CV info found for this user.</p>
      <button id="createCvBtn" class="btn">Create CV Now</button>
    `;
        // Listener לכפתור שיפנה לדף יצירת קורות חיים
        document
            .getElementById("createCvBtn")
            .addEventListener("click", () => {
                window.location.href = "../pages/firstSession.html"; // שנה לנתיב הרלוונטי
            });
        return;
    }

    // Inject CV content
    cvSection.innerHTML += `
      <p><strong>Display Name:</strong> ${currentUser.displayName}</p>
      <p><strong>Email:</strong> ${cv.email}</p>
      <p><strong>About:</strong> ${cv.about}</p>
      <p><strong>Phone:</strong> ${cv.phoneNumber}</p>
      <p><strong>GitHub:</strong> <a href="${cv.github}" target="_blank">${cv.github}</a></p>
      <p><strong>LinkedIn:</strong> <a href="${cv.linkedin}" target="_blank">${cv.linkedin}</a></p>
  
      <h3 class="mt-4">Skills</h3>
      <ul>${cv.skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
  
      <h3 class="mt-4">Projects</h3>
      <ul>${cv.projects.map(p => `
        <li>
          <strong>${p.projectName}</strong> ${p.projectDescription}<br>
          <a href="${p.projectLink}" target="_blank">${p.projectLink}</a>
        </li>`).join("")}
      </ul>
    `;

    if (cv.weather) {

        const weatherSection = document.getElementById("weatherSection");

        weatherSection.style.display = "block";

        // Load and display weather for the default country
        const countrySelect = document.getElementById("countrySelect");
        countrySelect.addEventListener("change", updateWeather);

        // Initial weather load
        await updateWeather();

    }

    if (cv.matach) {
        const matachSection = document.getElementById("matachSection");
        matachSection.style.display = "block";

        const fromSelect = document.getElementById("fromCurrency");
        const toSelect = document.getElementById("toCurrency");
        const convertBtn = document.getElementById("convertBtn");
        const rateSpan = document.getElementById("exchange-rate");
        const dateSpan = document.getElementById("exchange-date");

        // פעולה ראשונית
        await updateExchange();

        convertBtn.addEventListener("click", updateExchange);

        async function updateExchange() {
            const from = fromSelect.value;
            const to = toSelect.value;
            try {
                const data = await getExchangeRates(from, to);
                // נניח שה-API מחזיר מבנה { rate: number, date: string }
                rateSpan.textContent = data.rate.toFixed(4);
                dateSpan.textContent = new Date().toLocaleString();
            } catch (err) {
                console.warn("Failed to load exchange rates:", err);
                rateSpan.textContent = "Error";
                dateSpan.textContent = "-";
            }
        }
    }

    async function updateWeather() {
        const selectedCountry = countrySelect.value;
        try {
            const weather = await getWeatherByCountry(selectedCountry); // Fetch weather based on selected country
            if (weather) {
                const weatherSection = document.getElementById("weatherSection");
                weatherSection.classList.remove("d-none");
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

});
