import { RaphaelDrawer } from './painter/drawer/RaphaelDrawer';
import { DiagramGraphic } from './painter/graphics/DiagramGraphic';
import { Diagram } from './parser/diagram';

export { Diagram } from './parser/diagram';
export { DiagramPainter } from './painter/DiagramPainter';
export { DiagramGraphic } from './painter/graphics/DiagramGraphic';

export { RaphaelDrawer } from './painter/drawer/RaphaelDrawer';

export function sequenceDiagram(selector: string) {
  const ele = $(selector);
  const diagram = Diagram.parse(ele.text());

  const drawer = new RaphaelDrawer(diagram, {});
  drawer.setupCanvas(ele[0]);

  return new DiagramGraphic(drawer, diagram);
}
