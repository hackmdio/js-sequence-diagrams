import { BaseDrawer } from '../drawer/BaseDrawer';
import { ActorGraphic } from './ActorGraphic';
import { DrawingBox } from './GraphicBox';
import { IDrawableGraphic, IDrawingBox } from './interfaces';

export abstract class BaseSignalGraphic implements IDrawableGraphic {
  public box: IDrawingBox = new DrawingBox();
  public message: string;
  public actorAGraphic: ActorGraphic;
  public actorBGraphic: ActorGraphic;
  public type: 'Signal' | 'Note';

  public abstract layoutHeight(offsetY: number): void;

  public abstract draw(drawer: BaseDrawer);
}
