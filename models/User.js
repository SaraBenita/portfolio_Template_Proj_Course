
export default class User {
    constructor(userId, userName, email, password) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.image = null;
        this.cv = null; // CVInfo object, initially null
    }
}