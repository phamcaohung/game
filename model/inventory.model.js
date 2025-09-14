export default class Inventory {
    constructor({ item, user, lucky, atk = 0, def = 0, hp = 0 }) {
        this.item = item
        this.atk = atk
        this.def = def
        this.hp = hp
        this.user = user
        this.lucky = lucky
    }
}