import {
  ALIGN_CENTER,
  ALIGN_HORIZONTAL_CENTER,
  ALIGN_LEFT,
  ALIGN_VERTICAL_CENTER,
  BaseDrawer,
  IHashMap,
} from './BaseDrawer';

import { Diagram } from '../..';
import { ArrowType, LineType } from '../../parser/enum';
import { assert } from '../../utils';

interface IRaphaelDrawerOptions {
  ['font-size']?: string;
  ['font-family']?: string;
}

interface IRaphaelFont extends IHashMap {
  obj_?: RaphaelFont;
  ['font-size']?: number;
}

const RECT = {
  fill: '#fff',
  stroke: '#000000',
  'stroke-width': 2,
};

const LINE = {
  fill: 'none',
  stroke: '#000000',
  'stroke-width': 2,
};

Raphael.fn.line = function (x1: number, y1: number, x2: number, y2: number) {
  assert([x1, x2, y1, y2].every(n => Number.isFinite(n)), 'x1,x2,y1,y2 must be numeric');
  return this.path('M{0},{1} L{2},{3}', x1, y1, x2, y2);
};

export class RaphaelDrawer extends BaseDrawer {

  public static cleanText(text: string): string {
    return text.split('\n').map(x => x.trim()).join('\n');
  }

  private paper!: RaphaelPaper;

  private arrowTypes = {
    [ArrowType.FILLED]: 'black',
    [ArrowType.OPEN]: 'open',
  };

  private lineTypes = {
    [LineType.SOLID]: '',
    [LineType.DOTTED]: '-',
  };

  constructor(diagram: Diagram, options: IRaphaelDrawerOptions) {
    super(diagram);
    this.font = {
      'font-family': options['font-family'] || 'Andale Mono, monospace',
      'font-size': options['font-size'] || 16,
    };
  }

  public draw(container: HTMLElement) {
    super.draw(container);
    this.paper.setFinish();
  }

  public setupCanvas(container: HTMLElement) {
    this.paper = Raphael(container, 300, 200);
    this.paper.setStart();
  }

  public resize(width: number, height: number) {
    this.paper.setSize(width, height);
  }

  public textBBox(rawText: string, font: IRaphaelFont = this.font): BoundingBox {
    const text = RaphaelDrawer.cleanText(rawText);
    let p;
    if (font.obj_) {
      p = this.paper.print(0, 0, text, font.obj_, font['font-size']);
    } else {
      p = this.paper.text(0, 0, text);
      p.attr(font);
    }
    const bb = p.getBBox();
    p.remove();
    return bb;
  }

  public drawRect(x: number, y: number, w: number, h: number) {
    this.paper.rect(x, y, w, h).attr(RECT);
  }

  public drawText(
    x: number, y: number,
    rawText: string,
    font: IRaphaelFont = {},
    align: number = ALIGN_LEFT) {
    const text = RaphaelDrawer.cleanText(rawText);
    const bb = this.textBBox(text, font);
    let x1 = x;
    let y1 = y;
    if (align === ALIGN_CENTER || align === ALIGN_HORIZONTAL_CENTER) {
      x1 = x1 - bb.width / 2;
    }
    if (align === ALIGN_CENTER || align === ALIGN_VERTICAL_CENTER) {
      y1 = y1 - bb.height / 2;
    }
    let t;
    if (font.obj_) {
      t = this.paper.print(x1 - bb.x, y1 - bb.y, text, font.obj_, font['font-size']);
    } else {
      t = this.paper.text(x1 - bb.x - bb.width / 2, y1 - bb.y, text);
      t.attr(font);
      t.attr({
        'text-anchor': 'start',
      });
    }
    return t;
  }

  public drawLine(
    x1: number, y1: number, x2: number, y2: number,
    lineType?: LineType, arrowHead?: ArrowType) {
    const line = this.paper.line(x1, y1, x2, y2).attr(LINE);
    if (arrowHead !== undefined) {
      line.attr('arrow-end', `${this.arrowTypes[arrowHead]}-wide-long`);
    }
    if (lineType !== undefined) {
      line.attr('stroke-dasharray', this.lineTypes[lineType]);
    }
    return line;
  }
}
