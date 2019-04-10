import { Signal } from '../../parser/model';
import {
  ALIGN_HORIZONTAL_CENTER, ALIGN_LEFT,
  BaseDrawer, SELF_SIGNAL_WIDTH,
} from '../drawer/BaseDrawer';
import { BaseSignalGraphic } from './BaseSignalGraphic';

export const SIGNAL_MARGIN = 5;
export const SIGNAL_PADDING = 5;

// Margin around a note
export const NOTE_MARGIN = 10;
// Padding inside a note
export const NOTE_PADDING = 5;
// Overlap when using a "note over A,B"
export const NOTE_OVERLAP = 15;

export class SignalGraph extends BaseSignalGraphic {
  public signal: Signal;

  constructor(signal: Signal) {
    super();
    this.signal = signal;
  }

  public layoutHeight(offsetY: number): void {
    this.box.x = this.actorAGraphic.box.getCenterX();
    this.box.y = offsetY;
  }

  public draw(drawer: BaseDrawer) {
    if (this.signal.isSelf()) {
      this.drawSelfSignal(drawer);
    } else {
      this.drawSignal(drawer);
    }
  }

  private drawSelfSignal(drawer: BaseDrawer) {
    const y1 = this.box.y + SIGNAL_MARGIN + SIGNAL_PADDING;
    const y2 = y1 + this.box.height - 2 * SIGNAL_MARGIN - SIGNAL_PADDING;

    // Draw three lines, the last one with a arrow
    drawer.drawLine(this.box.x, y1, this.box.x + SELF_SIGNAL_WIDTH, y1, this.signal.lineType);
    drawer.drawLine(
      this.box.x + SELF_SIGNAL_WIDTH, y1,
      this.box.x + SELF_SIGNAL_WIDTH, y2, this.signal.lineType);
    drawer.drawLine(
      this.box.x + SELF_SIGNAL_WIDTH, y2,
      this.box.x, y2, this.signal.lineType, this.signal.arrowType);

    // Draw text
    const x = this.box.x + SELF_SIGNAL_WIDTH + SIGNAL_PADDING;
    const arrowHeight = (y2 - y1);
    const emptyVerticalSpace = arrowHeight - this.box.height;
    const topPadding = emptyVerticalSpace / 2;
    const y = y1 + topPadding;
    drawer.drawText(x, y, this.signal.message, drawer.font, ALIGN_LEFT);
  }

  private drawSignal(drawer: BaseDrawer) {
    const x2 = this.actorBGraphic.box.getCenterX();

    // Mid point between actors
    const x = (x2 - this.box.x) / 2 + this.box.x;
    let y = this.box.y + SIGNAL_MARGIN + SIGNAL_PADDING;

    // Draw the text in the middle of the signal
    drawer.drawText(x, y, this.signal.message, drawer.font, ALIGN_HORIZONTAL_CENTER);

    // Draw the line along the bottom of the signal
    // Padding above, between message and line
    // Margin below the line, between line and next signal
    y = this.box.y + this.box.height - SIGNAL_PADDING;
    drawer.drawLine(this.box.x, y, x2, y, this.signal.lineType, this.signal.arrowType);
  }

}
