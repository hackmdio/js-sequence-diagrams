import { Diagram } from '../../parser/diagram';
import { Placement } from '../../parser/enum';
import { Actor, Note, Signal } from '../../parser/model';
import { assert } from '../../utils';
import { BaseDrawer, DIAGRAM_MARGIN, SELF_SIGNAL_WIDTH } from '../drawer/BaseDrawer';
import { ACTOR_MARGIN, ACTOR_PADDING, ActorGraphic } from './ActorGraphic';
import { BaseSignalGraphic } from './BaseSignalGraphic';
import { IBoundingBox } from './interfaces';
import { NoteGraphic } from './NoteGraphic';
import {
  NOTE_MARGIN, NOTE_OVERLAP, NOTE_PADDING,
  SIGNAL_MARGIN, SIGNAL_PADDING, SignalGraph,
} from './SignalGraphic';
import { TITLE_MARGIN, TITLE_PADDING, TitleGraphic } from './TitleGraphic';

export class DiagramGraphic {
  private readonly drawer: BaseDrawer;
  private readonly diagram: Diagram;

  private width: number = 0;
  private height: number = 0;

  // temp var
  private minActorHeight = 0;
  private signalTotalHeight = 0;
  private layoutOffsetY = 0;

  // drawable object
  private title!: TitleGraphic;
  private actors: Map<number, ActorGraphic> = new Map<number, ActorGraphic>();
  private signalGraphics: BaseSignalGraphic[] = [];

  constructor(drawer: BaseDrawer, diagram: Diagram) {
    this.diagram = diagram;
    this.drawer = drawer;
  }

  public layout() {
    // 1. layout title
    this.setupAndLayoutTitle();
    // 2. setup actor object
    this.setupActor();
    // 3. setup setupSignal object
    this.setupSignal();
    // 4. layout signals and notes and actors in x-coordinate
    this.layoutWidthOfSignals();
    this.layoutWidthOfNotes();
    this.layoutWidthOfActors();
    // 5. layout all elements in y-coordinate
    this.layoutHeightOfActors();
    this.layoutHeightOfAllSignals();
    this.height += this.signalTotalHeight + 2 * this.minActorHeight + DIAGRAM_MARGIN;
    this.drawer.resize(this.width, this.height);
  }

  public draw() {
    if (this.title) {
      this.title.draw(this.drawer);
    }
    this.actors.forEach(ag => ag.draw(this.drawer));
    this.signalGraphics.forEach(sg => sg.draw(this.drawer));

  }

  private setupAndLayoutTitle() {
    this.layoutOffsetY += DIAGRAM_MARGIN;
    if (this.diagram.title) {
      this.title = new TitleGraphic();
      const bb = this.estimateText(this.diagram.title);

      Object.assign(this.title, {
        box: {
          height: bb.height + (TITLE_PADDING + TITLE_MARGIN) * 2,
          textBB: bb,
          width: bb.width + (TITLE_PADDING + TITLE_MARGIN) * 2,
          x: DIAGRAM_MARGIN,
          y: DIAGRAM_MARGIN,
        },
        message: this.diagram.title,
      });
      this.width += this.title.box.width;
      this.height += this.title.box.height;
      this.layoutOffsetY += +this.title.box.height;
    }
  }

  private setupActor() {
    let maxActorsHeight = this.minActorHeight;
    // generate object
    this.diagram.actors.forEach((actor) => {
      const bb = this.estimateText(actor.name);
      const actorGraph = new ActorGraphic(actor);
      Object.assign(actorGraph, {
        index: actor.index,
        name: actor.name,
      });
      Object.assign(actorGraph.box, {
        height: bb.height + (ACTOR_PADDING + ACTOR_MARGIN) * 2,
        width: bb.width + (ACTOR_PADDING + ACTOR_MARGIN) * 2,
        x: 0,
        y: 0,
      });
      this.actors.set(actor.index, actorGraph);
      maxActorsHeight = Math.max(actorGraph.box.height, maxActorsHeight);
    });

    // set height to every actors, let actor's height are equal
    this.actors.forEach((ag) => {
      ag.box.height = maxActorsHeight;
    });
    this.minActorHeight = maxActorsHeight;
  }

  private setupSignal() {
    this.diagram.signals.forEach((signal) => {
      let bs: BaseSignalGraphic;
      if (signal.type === 'Signal') {
        bs = this.setupSignalType(signal);
      } else if (signal.type === 'Note') {
        bs = this.setupNoteType(signal as unknown as Note);
      }
      // @ts-ignore
      this.signalTotalHeight += bs.box.height;
    });
  }

  private setupSignalType(signal: Signal): BaseSignalGraphic {
    const bb = this.estimateText(signal.message);
    const signalGraph = new SignalGraph(signal);
    signalGraph.type = 'Signal';
    Object.assign(signalGraph.box, {
      height: bb.height,
      textBB: Object.assign({}, bb),
      width: bb.width,
    });
    signalGraph.box.width += (SIGNAL_MARGIN + SIGNAL_PADDING) * 2;
    signalGraph.box.height += (SIGNAL_MARGIN + SIGNAL_PADDING) * 2;

    if (signal.isSelf()) {
      // TODO: Self signals need a min height
      signalGraph.actorAGraphic = this.actors.get(signal.actorA.index) as ActorGraphic;
      signalGraph.box.width += SELF_SIGNAL_WIDTH;
    } else {
      const actorA = Math.min(signal.actorA.index, signal.actorB.index);
      const actorB = Math.max(signal.actorA.index, signal.actorB.index);
      signalGraph.actorAGraphic = this.actors.get(actorA) as ActorGraphic;
      signalGraph.actorBGraphic = this.actors.get(actorB) as ActorGraphic;
      if (actorA !== signal.actorA.index) {
        signalGraph.reverseSignal = true;
      }
    }
    this.signalGraphics.push(signalGraph);
    return signalGraph;
  }

  private setupNoteType(note: Note): BaseSignalGraphic {
    const bb = this.estimateText(note.message);
    const noteGraphic = new NoteGraphic(note);
    noteGraphic.type = 'Note';
    noteGraphic.message = note.message;
    Object.assign(noteGraphic.box, {
      height: bb.height,
      textBB: Object.assign({}, bb),
      width: bb.width,
    });
    noteGraphic.box.width += (NOTE_MARGIN + NOTE_PADDING) * 2;
    noteGraphic.box.height += (NOTE_MARGIN + NOTE_PADDING) * 2;
    if (note.hasManyActors()) {
      const actor1 = (note.actor as Actor[])[0];
      const actor2 = (note.actor as Actor[])[1];
      const actorA = Math.min(actor1.index, actor2.index);
      const actorB = Math.max(actor1.index, actor2.index);
      noteGraphic.actorAGraphic = this.actors.get(actorA) as ActorGraphic;
      noteGraphic.actorBGraphic = this.actors.get(actorB) as ActorGraphic;
    } else {
      noteGraphic.actorAGraphic = this.actors.get((note.actor as Actor).index)  as ActorGraphic;
    }
    this.signalGraphics.push(noteGraphic);
    return noteGraphic;
  }

  private layoutWidthOfSignals() {
    this.signalGraphics.filter(s => s.type === 'Signal').forEach((bsg) => {
      const sg = bsg as unknown as SignalGraph;
      let a: number;
      let b: number;
      if (sg.signal.isSelf()) {
        a = sg.actorAGraphic.index;
        b = a + 1;
      } else {
        a = sg.actorAGraphic.index;
        b = sg.actorBGraphic.index;
      }
      this.actorEnsureDistance(a, b, sg.box.width);
    });
  }

  private layoutWidthOfNotes() {
    this.signalGraphics.filter(s => s.type === 'Note').forEach((bsg) => {
      const ng = bsg as unknown as NoteGraphic;
      let a: number;
      let b: number;
      let extraWidth = 2 * ACTOR_MARGIN;
      switch (ng.note.placement) {
        case Placement.LeftOf:
          b = ng.actorAGraphic.index;
          a = b - 1;
          break;
        case Placement.RightOf:
          a = ng.actorAGraphic.index;
          b = a + 1;
          break;
        case Placement.Over:
          if (ng.note.hasManyActors()) {
            a = ng.actorAGraphic.index;
            b = ng.actorBGraphic.index;
            extraWidth = -(NOTE_PADDING * 2 + NOTE_OVERLAP * 2);
          } else {
            a = ng.actorAGraphic.index;
            const d = ng.box.width / 2;
            this.actorEnsureDistance(a - 1, a, d);
            this.actorEnsureDistance(a, a + 1, d);
            return;
          }
          break;
      }
      // @ts-ignore
      this.actorEnsureDistance(a, b, ng.box.width + extraWidth);
    });
  }

  private layoutWidthOfActors() {
    let actorsX = 0;
    this.actors.forEach((ag) => {
      ag.box.x = Math.max(actorsX, ag.box.x);
      ag.signalHeight = this.signalTotalHeight;
      // TODO: This only works if we loop in sequence, 0, 1, 2, etc
      ag.distance.forEach((distance, b) => {
        const actorB = this.actors.get(b) as ActorGraphic;
        const maxDistance = Math.max(distance, ag.box.width / 2, actorB.box.width / 2);
        actorB.box.x = Math.max(
          actorB.box.x,
          ag.box.x + ag.box.width / 2 + maxDistance - actorB.box.width / 2,
        );
      });
      actorsX = ag.box.x + ag.box.width + ag.paddingRight;
    });
    this.width = Math.max(actorsX, this.width);
  }

  private layoutHeightOfActors() {
    this.actors.forEach((ag) => {
      ag.box.y = this.layoutOffsetY;
    });
    this.layoutOffsetY += this.minActorHeight;
  }

  private layoutHeightOfAllSignals() {
    this.signalGraphics.forEach((sg) => {
      sg.layoutHeight(this.layoutOffsetY);
      this.layoutOffsetY += sg.box.height;
    });
  }

  private estimateText(text: string): IBoundingBox {
    return this.drawer.textBBox(text);
  }

  private actorEnsureDistance(a: number, b: number, d: number) {
    assert(a < b, 'a must be less than or equal to b');
    if (a < 0) {
      // Ensure b has left margin
      const actorB = this.actors.get(b) as ActorGraphic;
      actorB.box.x = Math.max(d - actorB.box.width / 2, actorB.box.x);
    } else if (b >= this.actors.size) {
      // Ensure a has right margin
      const actorA = this.actors.get(a)  as ActorGraphic;
      actorA.paddingRight = Math.max(d, actorA.paddingRight);
    } else {
      const actorA = this.actors.get(a)  as ActorGraphic;
      actorA.distance[b] = Math.max(d, actorA.distance[b] ? actorA.distance[b] : 0);
    }
  }
}
