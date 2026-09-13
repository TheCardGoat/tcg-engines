import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableYellow } from "./disable.ts";
import { tearAsunderBlue } from "./tear-asunder.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Tear Asunder (ELE205) AAA", () => {
  it("gives the next Guardian attack +1 and makes the hit hero discard two cards", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tearAsunderBlue, disableYellow], resourcePoints: 8, deck: 6 },
      { hero: dash, hand: [prowlBlue, prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tearAsunderBlue);
    game.passBoth();
    Bravo.attackWith(disableYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    game.advanceToDecision(Bravo, "ordering");
    const ordering = Bravo.expectDecision("ordering");
    game.answerDecision(Bravo.id, {
      kind: "ordering",
      orderedIds: ordering.entries.map((entry) => entry.id),
    });
    game.advanceToDecision(Dash, "entity-target");
    const discarded = Dash.cardsIn("hand", prowlBlue).slice(0, 2);
    Dash.chooseTargets(...discarded);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(11);
    expect(Dash.zone("hand")).toHaveLength(1);
    expect(Dash.zone("graveyard")).toHaveLength(2);
  });

  it("enforces dominate by rejecting two defending cards from hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tearAsunderBlue, disableYellow], resourcePoints: 8, deck: 6 },
      { hero: dash, hand: [prowlBlue, prowlBlue], deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tearAsunderBlue);
    game.passBoth();
    Bravo.attackWith(disableYellow);

    expect(() => Dash.defendWith([prowlBlue, prowlBlue])).toThrow();
    expect(Dash.zone("hand")).toHaveLength(2);
  });
});
