/* tslint:disable:variable-name */
import { Diagram } from './diagram';

export class Parser {
  public Diagram: typeof Diagram;
  public yy: Diagram;
}

export const parser: Parser;

export function parse(input: string): Diagram;
