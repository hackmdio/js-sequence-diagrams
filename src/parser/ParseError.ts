/**
 * jison doesn't have a good exception, so we make one.
 * This is brittle as it depends on jison internals
 */
export class ParseError extends Error {
  constructor(message: string, hash: string) {
    super(hash);
    this.name = 'ParseError';
    this.message = (message || '');
  }
}
