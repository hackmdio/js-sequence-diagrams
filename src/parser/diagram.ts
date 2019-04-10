/**
 * js sequence diagrams
 * https://bramp.github.io/js-sequence-diagrams/
 * (c) 2012-2017 Andrew Brampton (bramp.net)
 * Simplified BSD license.
 */

import { ArrowType, LineType, Placement } from './enum';
import * as parser from './grammar';
import { Actor, Note, Signal } from './model';
import { ParseError } from './ParseError';

export class Diagram {
  public static Actor = Actor;
  public static Signal = Signal;
  public static Note = Note;

  public static LineType = LineType;
  public static ArrowType = ArrowType;
  public static Placement = Placement;

  /**
   * Turn "\\n" into "\n"
   * @param s
   */
  public static unescape(s: string) {
    return s.trim().replace(/^"(.*)"$/m, '$1').replace(/\\n/gm, '\n');
  }

  public static parse(input: string): Diagram {
    // Create the object to track state and deal with errors
    parser.parser.Diagram = Diagram;
    parser.parser.yy = new Diagram();
    parser.parser.yy.parseError = (message: string, hash: string) => {
      throw new ParseError(message, hash);
    };

    // Parse
    const diagram: Diagram = parser.parse(input);

    // Then clean up the parseError key that a user won't care about
    delete diagram.parseError;
    return diagram;
  }

  public title?: string = undefined;
  public actors: Actor[] = [];
  public signals: Signal[] = [];

  private parseError!: (message: string, hash: string) => void;

  /**
   * Return an existing actor with this alias, or creates a new one with alias and name.
   * @param inputAlias
   * @param name
   */
  public getActor(inputAlias: string, name: string) {
    const alias = inputAlias.trim();
    const actors = this.actors;

    for (const actor of actors) {
      if (actor.alias === alias) {
        return actor;
      }
    }

    const newLen = actors.push(new Actor(alias, (name || alias), actors.length));
    return actors[newLen - 1];
  }

  /**
   * Parses the input as either a alias, or a "name as alias", and returns the corresponding actor.
   * @param input
   */
  public getActorWithAlias(input: string) {
    const s = /([\s\S]+) as (\S+)$/im.exec(input);
    let alias: string;
    let name: string;
    if (s) {
      name = s[1].trim();
      alias = s[2].trim();
    } else {
      name = alias = input;
    }
    return this.getActor(alias, name);
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public addSignal(signal: Signal) {
    this.signals.push(signal);
  }
}
