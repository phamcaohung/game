export default class Token {
    constructor({ user, refreshToken, token }) {
        this.user = user,
        this.token = token
        this.createdAt = new Date()
        this.expiresAt = new Date(this.createdAt.getTime() + 6 * 60 * 60 * 1000) 
    }
}