import '@babel/polyfill';
import { DiagramPainter, IDiagramPainterDrawSvgOptions } from './painter/DiagramPainter';
import { Diagram } from './parser/diagram';

if (typeof jQuery !== 'undefined') {
  (($) => {
    $.fn.sequenceDiagram = function (options: IDiagramPainterDrawSvgOptions = { theme: 'simple' }) {
      return this.each(function () {
        const $this = $(this);
        const diagram = Diagram.parse($this.text());
        $this.html('');
        new DiagramPainter(diagram).drawSvg(this as HTMLElement, options);
      });
    };
  })(jQuery);
}
