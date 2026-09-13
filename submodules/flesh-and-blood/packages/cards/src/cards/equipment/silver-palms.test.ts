import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { silverPalms } from "./silver-palms.ts";

/**
 * Silver Palms (EVR086) — Merchant Arms d2, Blade Break.
 *
 * Printed: "At the start of each other hero's turn, if they have less {h} than
 * you, they may draw a card. If they do, you create a Silver token. Blade Break"
 */

describe("Silver Palms (EVR086) AAA", () => {
  it("happy: the lower-life opponent draws and you create a Silver token", () => {
    const game = FabTestEngine.start(
      // Dash sits at intellect with a one-card deck: only the trigger's draw
      // can add the unique card on top of the full hand.
      { hero: dash, life: 20, hand: 4, deck: [nimblismBlue] },
      { hero: bravo, arms: [silverPalms], life: 30, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn(); // bravo's turn: no trigger, the palms watch the OTHER hero's turns
    game.as(bravo).endTurn(); // dash's second turn begins: the trigger fires here
    game.untilIdle({ optionals: "accept" });

    expect(Dash.zone("hand")).toHaveLength(5);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabToken(game, "silver").toHaveCount(1);
  });

  it("boundary: an opponent at equal life is never offered the draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, life: 30, hand: 4, deck: [nimblismBlue] },
      { hero: bravo, arms: [silverPalms], life: 30, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn(); // bravo's turn (no trigger ' start of the OTHER hero's turn only)
    game.as(bravo).endTurn(); // dash's second turn begins: the trigger fires here
    game.untilIdle();

    expect(Dash.zone("hand")).toHaveLength(4);
    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabToken(game, "silver").toHaveCount(0);
  });

  it("timing: declining the draw creates no Silver token", () => {
    const game = FabTestEngine.start(
      { hero: dash, life: 20, hand: 4, deck: [nimblismBlue] },
      { hero: bravo, arms: [silverPalms], life: 30, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn(); // bravo's turn (no trigger ' start of the OTHER hero's turn only)
    game.as(bravo).endTurn(); // dash's second turn begins: the trigger fires here
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("hand")).toHaveLength(4);
    expectFabToken(game, "silver").toHaveCount(0);
  });
});
