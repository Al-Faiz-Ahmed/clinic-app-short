export class GlobalError extends Error {
    status;
    constructor(status, errMesg, heading = "INTERNAL SERVER ERROR") {
        super(errMesg);
        this.name = heading;
        this.stack = `Error: ${errMesg}`;
        this.status = status;
        Object.setPrototypeOf(this, GlobalError.prototype);
    }
}
