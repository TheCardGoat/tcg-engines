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
import { dodgeBlue } from "../defense-reactions/dodge.ts";
import { snatchRed } from "./snatch.ts";
import { nixTheNimbleRed } from "./nix-the-nimble.ts";

describe("Nix the Nimble family AAA", () => {
  it("happy: hitting banishes a reaction and completes the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nixTheNimbleRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [dodgeBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(nixTheNimbleRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("banished")).toContain(dodgeBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 1);
    expectFabCard(Bravo, nixTheNimbleRed).toBeIn("graveyard");
  });

  it("boundary: banishing a non-reaction does not complete the contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nixTheNimbleRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(nixTheNimbleRed);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });

  it("timing: a miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nixTheNimbleRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deck: [dodgeBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(nixTheNimbleRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(dodgeBlue.canonicalId);
  });
});
