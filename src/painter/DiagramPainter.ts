import { Diagram } from '../parser/diagram';
import { RaphaelDrawer } from './drawer/RaphaelDrawer';

export interface IDiagramPainterDrawSvgOptions {
  theme: 'hand' | 'simple';
}

export class DiagramPainter {
  private readonly diagram: Diagram;

  constructor(diagram: Diagram) {
    this.diagram = diagram;
  }

  public drawSvg(
    container: string | HTMLElement,
    options: IDiagramPainterDrawSvgOptions = { theme: 'simple' },
  ) {
    let containerElement: HTMLElement | null;
    if ((typeof container) === 'string') {
      containerElement = document.querySelector(container as string);
    } else {
      containerElement = container as HTMLElement;
    }
    if (containerElement) {
      const drawer = new RaphaelDrawer(this.diagram, {});
      drawer.draw(containerElement);
    }
  }
}
