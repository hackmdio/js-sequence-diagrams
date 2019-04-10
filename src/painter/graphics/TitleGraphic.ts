import { ALIGN_LEFT, BaseDrawer } from '../drawer/BaseDrawer';
import { DrawingBox } from './GraphicBox';
import { IDrawableGraphic } from './interfaces';

export const TITLE_PADDING = 5;
export const TITLE_MARGIN = 0;

export class TitleGraphic implements IDrawableGraphic {
  public box: DrawingBox = new DrawingBox();
  public message!: string;

  public draw(drawer: BaseDrawer) {
    drawer.drawTextBox(
      this.box,
      this.message,
      TITLE_MARGIN,
      TITLE_PADDING,
      ALIGN_LEFT,
    );
  }
}
