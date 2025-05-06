import User from '../models/User.js';
import CVInfo from '../models/CVInfo.js';
import Project from '../models/Project.js';

function seedUser() {
    // יצירת המשתמש
    const user = new User(
        1,
        "bob@example.com",
        "123456",
        "Bob"
    );
    user.image = "https://mitmachim.top/assets/uploads/files/1617866211586-guest.png";

    // יצירת פרויקטים
    const projects = [
        new Project(
            1,
            "Weather App",
            "Displays weather using OpenWeather API",
            "https://github.com/bob/weather-app"
        ),
        new Project(
            2,
            "Currency Converter",
            "Converts currencies using real-time forex API",
            "https://github.com/bob/forex-converter"
        )
    ];

    // יצירת מידע קורות חיים (CV)
    const cv = new CVInfo(
        "bob@example.com",
        "Full-stack developer with a focus on user-friendly apps.",
        ["React", "Node.js", "MongoDB"],
        projects,
        "+972500000000",
        "https://github.com/bob",
        "https://linkedin.com/in/bob"
    );
    cv.weather = false;
    cv.matach = false;

    user.cv = cv;

    // שמירה בלוקאל סטורג
    localStorage.setItem("users", JSON.stringify([user]));
}

if (!localStorage.getItem("users")) {
    seedUser();
}
