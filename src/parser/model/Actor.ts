import { IActor } from './IActor';

export class Actor implements IActor {
  public alias: string;
  public name: string;
  public index: number;

  constructor(alias: string, name: string, index: number) {
    this.alias = alias;
    this.name = name;
    this.index = index;
  }
}
