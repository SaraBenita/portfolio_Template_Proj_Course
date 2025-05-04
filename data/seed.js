import User from '../models/User.js';

// פונקציה לאתחול נתונים ראשוניים בלוקאל סטורג
function seedUser() {
    // יוצרים משתמש ומצמידים לו את המשימות
    const user = new User(
        1,
        "bob",
        "bob@example.com",
        "123456",
        "https://mitmachim.top/assets/uploads/files/1617866211586-guest.png",
        null
    );

    // שמירה בלוקאל סטורג'
    localStorage.setItem("users", JSON.stringify([user]));
}


if (!localStorage.getItem("users")) {
    seedUser();
}
