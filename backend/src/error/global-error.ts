export class GlobalError extends Error {
  status: number;
  constructor(
    status: number,
    errMesg: string,
    heading: string = "INTERNAL SERVER ERROR"
  ) {
    super(errMesg);
    this.name = heading;
    this.stack = `Error: ${errMesg}`;
    this.status = status;

    Object.setPrototypeOf(this, GlobalError.prototype);
  }
}