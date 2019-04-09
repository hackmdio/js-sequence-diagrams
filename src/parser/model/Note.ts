import { Placement } from '../enum';
import { Actor } from './Actor';

export class Note {
  public type = 'Note';
  public actor: Actor | Actor[];
  public placement: Placement;
  public message: string;

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
