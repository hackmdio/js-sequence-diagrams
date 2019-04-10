export class AssertException extends Error {
  public message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }

  public toString() {
    return `AssertException:  ${this.message}`;
  }
}

export function assert(exp: boolean, message: string) {
  if (!exp) {
    throw new AssertException(message);
  }
}
