import { ArrowType, LineType, Placement } from '../enum';
import { Actor } from './Actor';
import { ISequence, SequenceType } from './IActor';

export class Note implements ISequence {
  public type: SequenceType = 'Note';
  public actor: Actor | Actor[];
  public placement: Placement;
  public message: string;
  public actorA!: Actor;
  public actorB!: Actor;
  public arrowType!: ArrowType;
  public lineType!: LineType;

  constructor(actor: Actor | Actor[], placement: Placement, message: string) {
    if (this.hasManyActors() && (actor as Actor[])[0] === (actor as Actor[])[1]) {
      throw new Error('Note should be over two different actors');
    }
    this.actor = actor;
    this.placement = placement;
    this.message = message;
  }

  public hasManyActors() {
    return Array.isArray(this.actor);
  }
}
