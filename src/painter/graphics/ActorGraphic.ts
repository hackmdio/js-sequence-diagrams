import { Actor } from '../../parser/model';
import { ALIGN_CENTER, BaseDrawer } from '../drawer/BaseDrawer';
import { DrawingBox } from './GraphicBox';
import { IDrawableGraphic } from './interfaces';

export const ACTOR_MARGIN = 10;
export const ACTOR_PADDING = 10;

export class ActorGraphic implements IDrawableGraphic {

  public box: DrawingBox = new DrawingBox();
  public message!: string;

  public distance: number[] = [];
  public paddingRight: number = 0;

  public actor: Actor;
  public index!: number;

  public signalHeight: number = 0;

  constructor(actor: Actor) {
    this.actor = actor;
  }

  public draw(drawer: BaseDrawer) {
    // draw top textbox
    drawer.drawTextBox(
      this.box,
      this.actor.name,
      ACTOR_MARGIN,
      ACTOR_PADDING,
      ALIGN_CENTER,
    );

    // draw bottom textbox
    const bottomBox = this.box.clone();
    bottomBox.y = this.box.y + this.box.height + this.signalHeight;

    drawer.drawTextBox(
      bottomBox,
      this.actor.name,
      ACTOR_MARGIN,
      ACTOR_PADDING,
      ALIGN_CENTER,
    );

    // draw vertical line
    const cX = this.box.getCenterX();
    drawer.drawLine(
      cX, this.box.y + this.box.height - ACTOR_MARGIN,
      cX, this.box.y + this.box.height + ACTOR_MARGIN + this.signalHeight,
    );
  }
}
