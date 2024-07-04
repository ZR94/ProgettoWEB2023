class Comment {

    static counter = 0;

    constructor(user, text) {
        this.id = Comment.counter++;
        this.user = user;
        this.text = text;
    }

    /**
     * Prende un oggetto in formato json e lo trasforma in un oggetto js
     * @param json
     * @returns {any}
     */
    static from(json) {
        const e = Object.assign(new Comment(), json);
        return e;
    }
}
export default Comment;