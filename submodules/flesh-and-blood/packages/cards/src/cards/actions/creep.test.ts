import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { scuttleTheCanalRed } from "./scuttle-the-canal.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { creepRed } from "./creep.ts";

/**
 * Creep (AAC009) — Assassin Action - Attack, cost 0, 3{p}/3{d}. Stealth.
 *
 * Printed: When this attacks, the next attack with stealth you play this
 * combat chain gets go again.
 */

describe("Creep (AAC009) AAA", () => {
  it("happy: the next stealth attack this chain gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [creepRed, scuttleTheCanalRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(creepRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.advanceCombatTo("resolution");
    Bravo.playAttack(scuttleTheCanalRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: the next non-stealth attack this chain does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [creepRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(creepRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: go again is this-combat-chain — a later chain stealth attack does not keep it", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [creepRed, scuttleTheCanalRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(creepRed);
    game.closeCombat({ ordering: "listed" });
    Bravo.playAttack(scuttleTheCanalRed);
    game.advanceCombatTo("defend");

    expectCombat(game).notToHaveKeyword("go-again");
    expectFabPlayer(Bravo).toHaveAP(0);
  });
});
