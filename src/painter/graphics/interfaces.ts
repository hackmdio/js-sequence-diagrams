export interface IBoundingBox {
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface IDrawingBox {
  x: number;
  y: number;
  height: number;
  width: number;

  getCenterX(): number;

  getCenterY(): number;

  clone(): IDrawingBox;
}

export interface IDrawableGraphic {
  box: IDrawingBox;
  message: string;
}
