import { ArrowType, LineType } from '../enum';
import { Actor } from './Actor';

export class Signal {
  public type: 'Signal' | 'Note' = 'Signal';
  public actorA: Actor;
  public actorB: Actor;
  public linetype: LineType;
  public arrowtype: ArrowType;
  public message: string;

  constructor(actorA: Actor, signaltype: number, actorB: Actor, message: string) {
    this.actorA = actorA;
    this.actorB = actorB;
    // tslint:disable-next-line:no-bitwise
    this.linetype = signaltype & 3;
    // tslint:disable-next-line:no-bitwise
    this.arrowtype = (signaltype >> 2) & 3;
    this.message = message;
  }

  public isSelf() {
    return this.actorA.index === this.actorB.index;
  }
}
