import { ArrowType, LineType, Placement } from '../enum';
import { Actor } from './Actor';

export type SequenceType = 'Note' | 'Signal';

export interface IActor {
  alias: string;
  name: string;
  index: number;
}

export interface ISequence {
  type: SequenceType;
  actorA: Actor;
  actorB: Actor;
  lineType: LineType;
  arrowType: ArrowType;
  placement: Placement;
  message: string;
}
