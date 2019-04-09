import { Placement } from '../../parser/enum';
import { Note } from '../../parser/model';
import { ALIGN_LEFT, BaseDrawer } from '../drawer/BaseDrawer';
import { ACTOR_MARGIN } from './ActorGraphic';
import { BaseSignalGraphic } from './BaseSignalGraphic';
import { NOTE_MARGIN, NOTE_OVERLAP, NOTE_PADDING } from './SignalGraphic';

export class NoteGraphic extends BaseSignalGraphic {
  public note: Note;

  constructor(note: Note) {
    super();
    this.note = note;
  }

  public layoutHeight(offsetY: number): void {
    this.box.y = offsetY;

    const x1 = this.actorAGraphic.box.getCenterX();

    switch (this.note.placement) {
      case Placement.LEFTOF:
        this.box.x = x1 - ACTOR_MARGIN - this.box.width;
        break;
      case Placement.RIGHTOF:
        this.box.x = x1 + ACTOR_MARGIN;
        break;
      case Placement.OVER:
        if (this.note.hasManyActors()) {
          const x2 = this.actorBGraphic.box.getCenterX();
          const overlap = NOTE_OVERLAP + NOTE_PADDING;
          this.box.x = x1 - overlap;
          this.box.width = x2 + overlap - this.box.x;
        } else {
          this.box.x = x1 - this.box.width / 2;
        }
        break;
      default:
        throw new Error(`Unhandled note placement: ${this.note.placement}`);
    }
  }

  public draw(drawer: BaseDrawer) {
    return drawer.drawTextBox(
      this.box,
      this.message,
      NOTE_MARGIN,
      NOTE_PADDING,
      ALIGN_LEFT,
    );
  }

}
