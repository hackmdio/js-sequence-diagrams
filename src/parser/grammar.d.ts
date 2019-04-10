import { Diagram } from './diagram';

export interface Parser {
  Diagram: typeof Diagram;
  yy: Diagram;
}

export const parser: Parser;

export function parse(input: string): Diagram;
