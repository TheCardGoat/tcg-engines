import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

import { snatchRed } from "./snatch.ts";
import { robTheRichRed } from "./rob-the-rich.ts";

describe("Rob the Rich family AAA", () => {
  it("happy: hitting banishes a cost-2+ card and completes the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [robTheRichRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [brutalAssaultBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(robTheRichRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("banished")).toContain(brutalAssaultBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 1);
    expectFabCard(Bravo, robTheRichRed).toBeIn("graveyard");
  });

  it("boundary: banishing a cost-0 card does not complete the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [robTheRichRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(robTheRichRed);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });

  it("timing: a miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [robTheRichRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(robTheRichRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });
});
