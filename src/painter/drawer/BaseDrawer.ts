import { Diagram, DiagramGraphic } from '../..';
import { ArrowType, LineType } from '../../parser/enum';
import { DrawingBox } from '../graphics/GraphicBox';
import { IBoundingBox } from '../graphics/interfaces';

export interface IHashMap {
  [key: string]: any;
}

// Following the CSS convention
// Margin is the gap outside the box
// Padding is the gap inside the box
// Each object has x/y/width/height properties
// The x/y should be top left corner
// width/height is with both margin and padding

// TODO
// Image width is wrong, when there is a note in the right hand col
// Title box could look better
// Note box could look better

export const DIAGRAM_MARGIN = 10;

export const SELF_SIGNAL_WIDTH = 20; // How far out a self signal goes

export const ALIGN_LEFT = 0;
export const ALIGN_CENTER = 1;
export const ALIGN_HORIZONTAL_CENTER = 2;
export const ALIGN_VERTICAL_CENTER = 3;

export abstract class BaseDrawer {
  public font!: IHashMap;
  protected diagram: Diagram;

  protected constructor(diagram: Diagram) {
    this.diagram = diagram;
  }

  public draw(container: HTMLElement) {
    this.setupCanvas(container);
    const dg = new DiagramGraphic(this, this.diagram);
    dg.layout();
    dg.draw();
  }

  public drawTextBox(
    box: DrawingBox, text: string,
    margin: number, padding: number, align: number,
  ) {
    let x = box.x + margin;
    let y = box.y + margin;
    const w = box.width - 2 * margin;
    const h = box.height - 2 * margin;

    // Draw inner box
    this.drawRect(x, y, w, h);
    // Draw text (in the center)
    if (align === ALIGN_CENTER) {
      x = box.getCenterX();
      y = box.getCenterY();
    } else {
      x += padding;
      y += padding;
    }
    this.drawText(x, y, text, this.font, align);
  }

  public abstract setupCanvas(container: HTMLElement);

  public abstract resize(width: number, height: number) ;

  public abstract textBBox(text: string, font: IHashMap): IBoundingBox;

  public abstract drawRect(x: number, y: number, w: number, h: number);

  public abstract drawText(x: number, y: number, text: string, font: IHashMap, align: number);

  public abstract drawLine(
    x1: number, y1: number,
    x2: number, y2: number,
    lineType?: LineType, arrowHead?: ArrowType);
}
