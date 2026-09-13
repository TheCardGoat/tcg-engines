import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { barragingBeatdownBlue } from "./barraging-beatdown.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { sackTheShiftyRed } from "./sack-the-shifty.ts";

describe("Sack the Shifty family AAA", () => {
  it("happy: hitting banishes a base-go-again card and completes the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sackTheShiftyRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [barragingBeatdownBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(sackTheShiftyRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("banished")).toContain(barragingBeatdownBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 1);
    expectFabCard(Bravo, sackTheShiftyRed).toBeIn("graveyard");
  });

  it("boundary: banishing a card without base go again does not complete the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sackTheShiftyRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(sackTheShiftyRed);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });

  it("timing: a miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sackTheShiftyRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: [barragingBeatdownBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(sackTheShiftyRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(barragingBeatdownBlue.canonicalId);
  });
});
