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
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";

import { snatchRed } from "./snatch.ts";
import { alreadyDeadRed } from "./already-dead.ts";

describe("Already Dead (EVO236) AAA", () => {
  it("happy: hitting banishes deck top and a defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [alreadyDeadRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        arms: [ironrotGauntlet],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(alreadyDeadRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).toContain(ironrotGauntlet.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 1);
    expectFabCard(Bravo, alreadyDeadRed).toBeIn("graveyard");
  });

  it("boundary: banishing an action card does not complete the non-action contract", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [alreadyDeadRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(alreadyDeadRed);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });

  it("timing: a miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [alreadyDeadRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
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

    Bravo.playAttack(alreadyDeadRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });
});
