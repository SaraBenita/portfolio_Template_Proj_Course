// טוען את כל המשתמשים מה-localStorage
export function loadUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

// מחזיר את המשתמש הנוכחי, אם יש
export function getCurrentUser() {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
}

// מנתק את המשתמש ומעביר לדף הבית
export function logoutUser() {
    localStorage.removeItem("currentUser");
    document.location.href = "homePage.html";
}

// טוען את קורות החיים של משתמש לפי כתובת מייל
export function loadUserCVInfo(email) {
    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        console.warn(`User with email ${email} not found.`);
        return null;
    }

    return user.cv || null;
}

// שומר קורות חיים למשתמש לפי כתובת מייל
export function saveCVInfoToUser(email, CVInfo) {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        console.warn(`User with email ${email} not found.`);
        return false;
    }

    users[userIndex].cv = CVInfo;

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
    return true;
}

export async function getWeatherByCountry(country) {
    const countryToCityMap = {
        "Israel": "Jerusalem",
        "United States": "Washington",
        "France": "Paris",
        "Germany": "Berlin",
        "Japan": "Tokyo",
        "India": "New Delhi",
        "United Kingdom": "London"
    };

    const city = countryToCityMap[country];
    if (!city) {
        console.warn(`No city mapping found for country: ${country}`);
        return null;
    }

    const url = `https://wttr.in/${city}?format=j1`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();

        const current = data.current_condition?.[0];
        return {
            city,
            temperature: current.temp_C,
            description: current.weatherDesc?.[0]?.value,
            feelsLike: current.FeelsLikeC,
            humidity: current.humidity
        };
    } catch (error) {
        console.error("Weather fetch error:", error);
        return null;
    }
}

export async function getExchangeRates(from, to) {
    // אם המטבעות זהים – נחזיר תמיד 1 ולשונית התאריך הנוכחית
    if (from === to) {
        return {
            rate: 1,
            date: new Date().toISOString().split('T')[0]  // YYYY-MM-DD
        };
    }

    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    console.log("Fetch Frankfurter URL:", url);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Error fetching exchange rates: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    console.log("Frankfurter response:", json);

    if (!json.rates || json.rates[to] === undefined) {
        throw new Error(`Rate for '${to}' not found`);
    }

    return {
        rate: json.rates[to],
        date: json.date
    };
}





