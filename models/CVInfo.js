
export default class CVInfo {
    constructor(email, about, skills, projects, phoneNumber, github, linkedin) {
        this.email = email; // כתובת האימייל של המועמד
        this.about = about; // תיאור קצר על המועמד
        this.skills = skills; // רשימת הכישורים של המועמד
        this.projects = projects; // רשימת הפרויקטים של המועמד
        this.phoneNumber = phoneNumber; // מספר הטלפון של המועמד
        this.github = github; // קישור לפרופיל הגיטהאב של המועמד
        this.linkedin = linkedin; // קישור לפרופיל הלינקדאין של המועמד
        this.weather = false; // קישור לאתר מזג האוויר של המועמד
        this.matach = false; // קישור לאתר מתאץ של המועמד
    }
}

