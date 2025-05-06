export default class User {
    constructor(userId,email, password, displayName) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.image = null;
        this.cv = null;
        this.displayName = displayName
    }
}
