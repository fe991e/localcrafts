class ExpressErrs extends Error{
    constructor(message, statCode){
        super();
        this.message = message;
        this.statCode = statCode;
    }
}

module.exports = ExpressErrs;