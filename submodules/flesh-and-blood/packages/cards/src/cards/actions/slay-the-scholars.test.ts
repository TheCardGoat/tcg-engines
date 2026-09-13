import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { slayTheScholarsRed } from "./slay-the-scholars.ts";

describe("Slay the Scholars family AAA", () => {
  it("happy: hitting banishes a non-attack action and completes the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [slayTheScholarsRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(slayTheScholarsRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 1);
    expectFabCard(Bravo, slayTheScholarsRed).toBeIn("graveyard");
  });

  it("boundary: banishing an attack action does not complete the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [slayTheScholarsRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [brutalAssaultBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(slayTheScholarsRed);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(brutalAssaultBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });

  it("timing: a miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [slayTheScholarsRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deck: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(slayTheScholarsRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
  });
});
