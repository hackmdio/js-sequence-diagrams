import { ArrowType, LineType, Placement } from '../enum';
import { Actor } from './Actor';
import { ISequence, SequenceType } from './IActor';

export class Signal implements ISequence {
  public type: SequenceType = 'Signal';
  public actorA: Actor;
  public actorB: Actor;
  public lineType: LineType;
  public arrowType: ArrowType;
  public message: string;

  public placement!: Placement;

  constructor(actorA: Actor, signalType: number, actorB: Actor, message: string) {
    this.actorA = actorA;
    this.actorB = actorB;
    // tslint:disable-next-line:no-bitwise
    this.lineType = signalType & 3;
    // tslint:disable-next-line:no-bitwise
    this.arrowType = (signalType >> 2) & 3;
    this.message = message;
  }

  public isSelf() {
    return this.actorA.index === this.actorB.index;
  }
}
