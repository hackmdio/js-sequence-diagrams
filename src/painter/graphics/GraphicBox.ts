import { IDrawingBox } from './interfaces';

export class DrawingBox implements IDrawingBox {
  public x: number = 0;
  public y: number = 0;

  public height: number = 0;
  public width: number = 0;

  public getCenterX(): number {
    return this.x + this.width / 2;
  }

  public getCenterY(): number {
    return this.y + this.height / 2;
  }

  public clone(): DrawingBox {
    const that = new DrawingBox();
    Object.assign(that, {
      height: this.height,
      width: this.width,
      x: this.x,
      y: this.y,
    });
    return that;
  }
}
