import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { aetherSlashRed } from "./aether-slash.ts";

/**
 * Aether Slash, Red (DYN182) — Runeblade Action - Attack, cost 1,
 * 4{p}.
 * Printed: "When Aether Slash attacks, if a 'non-attack' action card was
 * pitched to play it, deal 1 arcane damage to any target."
 */

describe("Aether Slash, Red (DYN182) AAA", () => {
  it("happy: a non-attack action pitched deals 1 arcane at declaration, then 4 combat", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        resourcePoints: 0,
        hand: [aetherSlashRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(aetherSlashRed, { pitch: [nimblismBlue], stopAt: "on-attack" });
    Teklo.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: an ATTACK card pitched deals no arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        resourcePoints: 0,
        hand: [aetherSlashRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(aetherSlashRed, { pitch: [snatchRed], stopAt: "on-attack" });
    game.advanceCombatTo("defend");

    expectFabPlayer(Dash).toHaveLife(20);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: no pitch at all leaves the rider dormant", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        resourcePoints: 1,
        hand: [aetherSlashRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(aetherSlashRed, { stopAt: "on-attack" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
